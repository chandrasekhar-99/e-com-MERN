import {useState,useEffect} from 'react'
import ReactReadMoreReadLess from "react-read-more-read-less";
import Statistics from '../Statistics';
import BarChart from '../BarChart';
import PieChart from '../PieChart';
import './index.css'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
]

const Dashboard = ()=>{
  const [selectedMonth, setSelectedMonth] = useState('March')
  const [selectTransaction, setSelectedTransaction] = useState('')
  const [dataTransaction,setDataTransaction] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  

  

  

  useEffect(() => {

    const apiUrl = `${process.env.REACT_APP_API_URL}/api/transactions/search?searchKey=${selectTransaction}&page=${pageNum}`

    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDataTransaction(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectTransaction,pageNum]);

  const selectMonth = (event) => {
    setSelectedMonth(event.target.value)
  }

  const searchTransaction = (event) => {
    setSelectedTransaction(event.target.value)
  }

  const nextPage = () => {
    setPageNum(pageNum + 1)
  }

  const previousPage = () => {
    if (pageNum > 1){
      setPageNum(pageNum - 1)
    }
  }

    const renderTransactions=()=>{
        return(
            <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Sold</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody>
                {dataTransaction.map(eachItem=>(
                    <tr key = {eachItem.id} className='table-elements'>
                        <td>{eachItem.id}</td>
                        <td>{eachItem.title}</td>
                        <td><ReactReadMoreReadLess charLimit = {150} readMoreText={"Read More"}  readLessText={"Read Less"} >
                            {eachItem.description}
                        </ReactReadMoreReadLess></td>
                       { /*<td>{eachItem.description}</td>*/}
                        <td>{eachItem.price}</td>
                        <td>{eachItem.category}</td>
                        <td>{String(eachItem.sold)}</td>
                        <td><img className='table-product-image' src={eachItem.image} alt={eachItem.title}/></td>
                    </tr>
                ))}
            </tbody>
        </table>
        )
    }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
    return(
      <div className="dashboard-container">
        <div className="heading-container">
                <p>
                Transaction
                <br/>
                Dashboard
                </p>
        </div>
        <div className='select-container'>
          
            <input className='search-transaction' type="search" placeholder="Search transaction" value={selectTransaction} onChange={searchTransaction}/>
            
            <select className='month-dropdown' value={selectedMonth} onChange={selectMonth}>
              {months.map(each=>(
                <option className='month-list' key={each}>{each}</option>
              ))}
            </select>
           
        </div>
        
        <div>{renderTransactions()}</div>

        <div className='page-container'>
          <p>Page No: 1</p>
          <div className='page-container-2'>
            <button onClick={nextPage} className='page-buttons' type="button">Next</button>
            <p>-</p>
            <button onClick={previousPage} className='page-buttons' type="button">previous</button>
          </div>
          <p>Per Page : 10</p>
        </div>

        <Statistics setMonth = {selectedMonth}/>
        <div className='charts-container'>
          <BarChart setMonth = {selectedMonth}/>
          <PieChart setMonth = {selectedMonth}/>
        </div>
      </div>
    )
  
}

export default Dashboard