import React,{useState,useEffect} from 'react'
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';



const PieChart = (props)=> {
    const [pieDataTransaction,setPieDataTransaction] = useState()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {setMonth} = props

    console.log(typeof(pieDataTransaction));
  


    useEffect(() => {

        const apiUrl = `${process.env.REACT_APP_API_URL}/api/rox-api?month=${setMonth}`
    
        const fetchData = async () => {
          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPieDataTransaction(data);
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

    const pieStatData = pieDataTransaction.pieChartData;
    
    const statDataLabels = Object.keys(pieStatData);
    const statDataValues = Object.values(pieStatData);

    

    const pieChartData = {
      labels: statDataLabels,
      datasets: [
          {
              label: "no.of items",
              data: statDataValues,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(255, 206, 86, 0.6)',
                  'rgba(75, 192, 192, 0.6)',
              ],

              borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
              ],
              
              hoverOffset: 8,
          },
      ],
  };

    return(
        <div>
          <h2>Pie Chart Stats - {setMonth}</h2>
          <Pie type="pie" data={pieChartData}/>
          
        </div>
    )
}

export default PieChart