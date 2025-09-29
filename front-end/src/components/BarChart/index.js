
import {useState,useEffect} from 'react'

import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './index.css'





const BarChart = (props)=> {
    const [barDataTransaction,setBarDataTransaction] = useState([])
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
            setBarDataTransaction(data);
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

    const barStatData = barDataTransaction.barChartData;
    
    const bar = barStatData.salesByPriceRange;

    const chartData = {
      labels: bar.map(item => item.range),
      datasets: [
          {
              label: 'Sales Count by Price Range',
              data: bar.map(item => item.count),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 3)',
              borderWidth: 1,
              
          },
      ],
  };

  
    

   

    return(
        <div>
          <h2>Bar Chart Stats - {setMonth}</h2>
          
          <Bar data={chartData}  />
        </div>
    )
}

export default BarChart
