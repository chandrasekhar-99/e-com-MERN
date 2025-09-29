import React,{useState,useEffect} from 'react'
import './index.css'



const Statistics = (props)=> {
    const [statDataTransaction,setStatDataTransaction] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {setMonth} = props

  


    useEffect(() => {

        const apiUrl = `${process.env.REACT_APP_API_URL}/api/rox-api?month=${setMonth}`
    
        const fetchData = async () => {
          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setStatDataTransaction(data);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
    }, [setMonth]);

   
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const statData = statDataTransaction.statisticsData;

    return(
      <>
        <h2>Statistics - {setMonth}</h2>
        <div className='stat-container'>
          <div className='stat-data-row'>
            <span className='stat-data'>Total Sale:</span>
            <span className='stat-data-value'>{statData.uniqueSale}</span>
          </div>
          <div className='stat-data-row'>
            <span className='stat-data'>Total Sold Item:</span>
            <span className='stat-data-value'>{statData.uniqueSoldData}</span>
          </div>
          <div className='stat-data-row'>
            <span className='stat-data'>Total Not Sold Item:</span>
            <span className='stat-data-value'>{statData.uniqueNoSoldData}</span>
          </div>
        </div>
      </>
    )
}

export default Statistics