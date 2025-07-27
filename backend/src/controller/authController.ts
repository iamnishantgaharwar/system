import { Response, Request } from "express";
import bcrypt from "bcrypt-ts";
import prisma from "../lib/prisma";
import {
  registerSchema,
  RegisterRequest,
  loginSchema,
  LoginRequest,
  logoutSchema,
  LogoutRequest,
  refreshSchema,
  refreshRequest,
} from "../zodSchema/authSchema";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const validateData = registerSchema.safeParse(req.body);

    if (!validateData.success) {
      const errorMessages = validateData.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        error: errorMessages,
      });
    }
    const { firstName, lastName, email, password, type } =
      validateData.data as RegisterRequest;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exist",
      });
    }

    // Now we checked that email is not present than we can use our resources to hash the user password

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    const fetchRole = await prisma.role.findUnique({
      where: {
        role: type, // "User" | "Student" | "Teacher"
      },
    });

    if (!fetchRole) {
      throw new Error('Default role "User" not found');
    }

    await prisma.userRole.create({
      data: {
        user: {
          connect: { userId: newUser.userId },
        },
        role: {
          connect: { roleId: fetchRole.roleId },
        },
      },
    });

    const { password: _, ...userDetails } = newUser;
    return res.status(201).json({
      message: "User register successfully",
      data: { userDetails, Role: fetchRole.role },
    });
  } catch (err) {
    console.error("Error while registering user", err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  try {
    const validateLoginData = loginSchema.safeParse(req.body);

    if (!validateLoginData.success) {
      const errorMessage = validateLoginData.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        error: errorMessage,
      });
    }

    const { email, password } = validateLoginData.data as LoginRequest;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const validPassword = await bcrypt.compare(password, user!.password);

    if (!validPassword) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }

    const userDetails = await prisma.user.findUnique({
      where: { userId: user?.userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        UserRole: {
          select: {
            role: true,
          },
        },
      },
    });

    // First we need to revoke all tokens 

    await prisma.refreshToken.updateMany({
      where: {
        userId: user?.userId,
        revoked: false,
        expiresAt: {gt: new Date()}
      },
      data: {
        revoked: true
      }
    })

    const newAccessToken = generateAccessToken({
      userId: user!.userId,
      fullname: `${userDetails?.firstName} ${userDetails?.lastName}`,
      email: userDetails!.email,
      role: userDetails?.UserRole.map(
        (userRole: { role: { role: string } }) => userRole.role.role
      ) as string[],
    });
    const newRefreshToken = generateRefreshToken();

    if (!user?.userId) {
      throw new Error("User ID is required");
    }

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user?.userId,
        revoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      success: true,
      data: [
        {
          token: newAccessToken,
          refreshToken: newRefreshToken,
        },
      ],
    });

  } catch (err) {
    console.error("Something went wrong");
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

// logout
export const logout = async (req: Request, res: Response) => {
  try{
    const validateLogout = logoutSchema.safeParse(req.body)

    if(!validateLogout.success){
      const errorMessage = validateLogout.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      return res.status(400).json({
        error: errorMessage
      })
    }

    const { refreshToken } = validateLogout.data as LogoutRequest

    const tokenInDb = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken
      }
    })

    if(!tokenInDb){
      return res.status(404).json({
        error: 'Refresh token not found'
      })
    }

    await prisma.refreshToken.update({
      where: {
        token: refreshToken
      },
      data: {
        revoked: true
      }
    })

    return res.status(200).json({ message: "Logged out successfully" });
  } catch(err){
    res.status(500).json({
      error: 'Something went wrong'
    })
    throw new Error('Something went wrong')
  }
};

// refresh-token
export const refresh = async (req: Request, res: Response) => {
  try{
    const validateRefreshToken = refreshSchema.safeParse(req.body)

    if(!validateRefreshToken.success){
      const errorMessage = validateRefreshToken.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))

      return res.status(400).json({
        error: errorMessage
      })
    }

    const { refreshToken } = validateRefreshToken.data as refreshRequest

    const tokenInDb = await prisma.refreshToken.findUnique({
      where: { token: refreshToken}
    })

    if (tokenInDb?.revoked === true) {
      // Revoke all tokens for this user as a security measure
      await prisma.refreshToken.updateMany({
          where: {
              userId: tokenInDb.userId,
              revoked: false,
          },
          data: {
              revoked: true
          }
      });
      return res.status(401).json({  // 401 Unauthorized is more appropriate here
          success: false,
          error: 'Security alert: Potential token reuse detected. Please log in again.'
      });
  }

    if(!tokenInDb){
      return res.status(404).json({
        error: 'Invalid Token'
      })
    }

    // revoke old token
    await prisma.refreshToken.update({
      where: {
        token: refreshToken,
        revoked: false,
        userId: tokenInDb?.userId
      },
      data: {
        revoked: true
      }
    })

    // Fetching user data for new token generation

    const userDetails = await prisma.user.findUnique({
      where: {userId: tokenInDb?.userId},
      select: {
        firstName: true,
        lastName: true,
        email: true,
        UserRole: {
          include: {
            role: true
          }
        }
      }
    })

    const renewAccessToken = generateAccessToken({
      userId: tokenInDb!.userId,
      email: userDetails!.email,
      fullname: `${userDetails?.firstName} ${userDetails?.lastName}`,
      role: userDetails?.UserRole.map(
        (userRole: { role: { role: string } }) => userRole.role.role
      ) as string[],
    })
    const renewRefreshToken = generateRefreshToken()

    if(!tokenInDb?.userId){
      throw new Error("userid required")
    }

    await prisma.refreshToken.create({
      data: {
        token: renewRefreshToken,
        userId: tokenInDb?.userId,
        revoked: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      success: true,
      data: [
        {
          token: renewAccessToken,
          refreshToken: renewRefreshToken,
        },
      ],
    });

  } catch(err){
    console.error(err)
    return res.status(500).json({
      error: 'Something went wrong'
    })
  }
}
