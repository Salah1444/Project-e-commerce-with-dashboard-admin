import  { useEffect, useState } from 'react'

function Counter({ final_time, speed = 10 }) {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        if (count < final_time) {
            const timer = setTimeout(() => {
                setCount(prev => prev + 1) // ✅ أحسن من count + 1
            }, speed)
            
            return () => clearTimeout(timer);
        }
    }, [count, final_time, speed]) // ✅ أضف التبعيات
    
    return count
}

export default Counter