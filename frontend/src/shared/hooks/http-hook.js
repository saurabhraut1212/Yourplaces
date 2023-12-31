import {useState,useCallback,useRef,useEffect} from "react";

export const useHttpClient=()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const activeHttpRequests=useRef([]);

    const sendRequest= useCallback( async (url,method="GET" ,body=null ,headers={})=>{
        try {
            setIsLoading(true)

            const httpAbortControl=new AbortController();
            activeHttpRequests.current.push(httpAbortControl)
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal:httpAbortControl.signal
            });
            const responseData = await response.json();

            activeHttpRequests.current=activeHttpRequests.current.filter(
                reqCtrl=>reqCtrl!==httpAbortControl
            )

            if (!response.ok) {
                throw new Error(responseData.message)
            }

            setIsLoading(false)
            return responseData;
        } catch (error) {
            setError(error.message)
            setIsLoading(false)
            throw error;
            
        }
        
        

    },[]);

    const clearError=()=>{
        setError(null)
    }

    useEffect(()=>{
        return ()=>{
            activeHttpRequests.current.forEach(abortCtrl=>abortCtrl.abort())
        }
    },[])
    return {isLoading,error,sendRequest,clearError}
}