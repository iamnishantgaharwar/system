import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { data } from "react-router-dom"

interface IUseFetch {
    baseUrl? : string
    endpoint: string
    request: 'Get' | 'Post' | 'Put' | 'Delete'
}
const useApiCall = ({ baseUrl, endpoint, request }: IUseFetch) => {
    const [defaultUrl, setDefaultUrl] = useState<string>("http://localhost:3000")
    const [data, setData] = useState()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState(null)

    useEffect(() => {
      if(baseUrl){
        setDefaultUrl(baseUrl)
      }
    }, [baseUrl])
    
    const instance = axios.create({
      baseURL: defaultUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })


    const apiCall = useCallback(() => {
      switch (request) {
        case 'Get':
          setLoading(true)
          instance.get(endpoint)
          .then(res => setData(res.data))
          .catch(res => setError(res))
          .finally(() => setLoading(false))
          break;
          case 'Post':
            setLoading(true)
            instance.post(endpoint)
            .then(res => setData(res.data))
            .catch(res => setError(res))
            .finally(() => setLoading(false))
            break;
          case 'Put':
            setLoading(true)
            instance.put(endpoint)
            .then(res => setData(res.data))
            .catch(res => setError(res))
            .finally(() => setLoading(false))
            break;
          case 'Delete':
            setLoading(true)
            instance.delete(endpoint)
            .then(res => setData(res.data))
            .catch(res => setError(res))
            .finally(() => setLoading(false))
            break;
      }
    }, [endpoint])

  return { data, error, loading}
}

export default useApiCall