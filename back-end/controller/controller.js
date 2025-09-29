const roxColl = require('../model/transaction')

const axios = require('axios');


//initialize DB

const initialize =  async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const jsonData = response.data;

       
        await roxColl.insertMany(jsonData, { ordered: false });
       
        res.send('Database initialized with seed data successfully!');
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Full data API

const transactions = async (req,res)=>{
    try {
        const data = await roxColl.find();

        const uniqueData= (data) => {
            const uniqueIds = new Set();
            return data.filter(item => {
                if (!uniqueIds.has(item.id)) {
                    uniqueIds.add(item.id);
                    return true;
                }
                return false;
            });
        }

        const unique = uniqueData(data);
        res.json(unique);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
};


//search product and pagination api
//localhost:8000/transactions/search?searchKey=""

const search = async (req,res)=>{

    try {
        const {searchKey, page, perpage=10 } = req.query;
            query = {
                "$or":[
                    {"title":new RegExp(searchKey, "i") },
                    {"description":new RegExp(searchKey, "i")},
                    { "price": isNaN(searchKey) ? 0 : Number(searchKey) }
                ]
            }
        
        const transactions = await roxColl.find(query).skip((page-1)*perpage).limit(parseInt(perpage))
        
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//statistics totalSaleAmount, soldItems, notSoldItems
//localhost:8000/statistics?month=""

const statistics = async (req,res)=>{
    const { month } = req.query;
    
    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    const mine = new Date(`${month} 1, 2000`);

    const date = mine.getMonth()+1;

    const monthNumber = date.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });


    const startDate1 = new Date(2021, monthNumber - 1, 1);
    const endDate1 = new Date(2021, monthNumber, 1);
    const startDate2 = new Date(2022, monthNumber - 1, 1);
    const endDate2 = new Date(2022, monthNumber, 1);

    try {

        const totalSaleAmount = await roxColl.aggregate([
        { $match:{"sold": true,$or:[
            {  "dateOfSale": { $gte: startDate1, $lt: endDate1 } },
            {  "dateOfSale": { $gte: startDate2, $lt: endDate2 } }
        ]
        } },
        { $group: { _id: null, totalAmount: { $sum: '$price' } } }
        ]);

        
        const total = totalSaleAmount.length ? totalSaleAmount[0].totalAmount : 0
        

        const uniqueSale = total/2;

        const totalSoldItems = await roxColl.find({
        "sold": true,
        $or:[
            {  "dateOfSale": { $gte: startDate1, $lt: endDate1 } },
            {  "dateOfSale": { $gte: startDate2, $lt: endDate2 } }
        ]
        });

        const updatedSold = (totalSoldItems) => {
            const uniqueIds = new Set();
            return totalSoldItems.filter(item => {
                if (!uniqueIds.has(item.id)) {
                    uniqueIds.add(item.id);
                    return true;
                }
                return false;
            });
        }

        const uniqueSoldData = updatedSold(totalSoldItems).length;

        const totalNotSoldItems = await roxColl.find({
        "sold": false,
        $or:[
            {  "dateOfSale": { $gte: startDate1, $lt: endDate1 } },
            {  "dateOfSale": { $gte: startDate2, $lt: endDate2 } }
        ]
        });

        const updatedNoSold = (totalNotSoldItems) => {
            const uniqueIds = new Set();
            return totalNotSoldItems.filter(item => {
                if (!uniqueIds.has(item.id)) {
                    uniqueIds.add(item.id);
                    return true;
                }
                return false;
            });
        }

        const uniqueNoSoldData = updatedNoSold(totalNotSoldItems).length;

        const statCom = {uniqueSale,uniqueSoldData,uniqueNoSoldData}

        res.json(statCom);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//Bar Chart API By Price
//localhost:8000/barChartData?month=""

const barChart = async (req,res)=>{
    const { month } = req.query;
    const mine = new Date(`${month} 1, 2022`);

    const date = mine.getMonth()+1;

    const monthNumber = date.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    

    const startDate1 = new Date(2021, monthNumber - 1, 1);
    const endDate1 = new Date(2021, monthNumber, 1);
    const startDate2 = new Date(2022, monthNumber - 1, 1);
    const endDate2 = new Date(2022, monthNumber, 1);

    try {
        const data = await roxColl.find({
            $or:[
                {  "dateOfSale": { $gte: startDate1, $lt: endDate1 } },
                {  "dateOfSale": { $gte: startDate2, $lt: endDate2 } }
            ]
        });

        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity },
        ];

         
        const uniqueBarChartData= (data) => {
            const uniqueIds = new Set();
            return data.filter(item => {
                if (!uniqueIds.has(item.id)) {
                    uniqueIds.add(item.id);
                    return true;
                }
                return false;
            });
        }

        const uniqueBar = uniqueBarChartData(data);

        const salesByPriceRange = priceRanges.map(range => {
            const count = uniqueBar.filter(sale => sale.price >= range.min && sale.price <= range.max).length;
            return { range: range.range, count };
        });

        const totalSalesAmount = uniqueBar.reduce((total, sale) => total + sale.price, 0);
    
 
        res.json({salesByPriceRange,totalSalesAmount});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//Pie Chart API By category
//localhost:8000/pieData?month=""

const pieChart = async (req,res)=>{
    const {month} = req.query;
        
    const mine = new Date(`${month} 1, 2000`);

    const date = mine.getMonth()+1;

    const monthNumber = date.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    

    const startDate1 = new Date(2021, monthNumber - 1, 1);
    const endDate1 = new Date(2021, monthNumber, 1);
    const startDate2 = new Date(2022, monthNumber - 1, 1);
    const endDate2 = new Date(2022, monthNumber, 1);
     
    try{
    
        const data = await roxColl.find({
            $or:[
                {  "dateOfSale": { $gte: startDate1, $lt: endDate1 } },
                {  "dateOfSale": { $gte: startDate2, $lt: endDate2 } }
            ]
        });

        const uniquePieData= (data) => {
            const uniqueIds = new Set();
            return data.filter(item => {
                if (!uniqueIds.has(item.id)) {
                    uniqueIds.add(item.id);
                    return true;
                }
                return false;
            });
        }

        const uniquePie = uniquePieData(data);

        const categories = {}

        uniquePie.forEach(item =>{
            const category = item.category;
            if (categories.hasOwnProperty(category)){
                categories[category]++;
            }else{
                categories[category] = 1;
            }
        })

        
        res.json(categories)
    }catch (error){
        res.status(500).json({ error: error.message });
    }

};


//combined data of  3 APIs
//localhost:8000/rox-api?month=november

const roxApi = async (req,res)=> {
    const {month} = req.query;
    try{
        const [statistics, barData, pieData] = await Promise.all([
            axios.get(`http://localhost:8000/api/statistics?month=${month}`),
            axios.get(`http://localhost:8000/api/bar-chart?month=${month}`),
            axios.get(`http://localhost:8000/api/pie-chart?month=${month}`)
        ]);

        const combinedData = {
        statisticsData: statistics.data,
        barChartData: barData.data,
        pieChartData: pieData.data
        }
        

          res.json(combinedData)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    initialize,transactions,search,statistics,barChart,pieChart,roxApi
}