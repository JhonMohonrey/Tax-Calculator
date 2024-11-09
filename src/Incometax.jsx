import React from 'react';
import './Design/app.css'

function Incometax(props) {
    let [renderSalary, setRenderSalary] = React.useState(0)

    let [mCon, setMCon] = React.useState([
        {
            sssContribution: 0,
            philHealthContribution: 0,
            pagIbigContribution: 100,
            tax:  0,
            income: 0,
            
        }
    ]) 

    const userMonthlySalary = (event) => {
        // Get the value from the input event, remove commas for proper numeric formatting
        let UI = event.target.value.replace(/,/g, ""); // Remove commas for numerical calculations

        // Check if the value is a valid number and not an empty string
        if (!isNaN(UI) && UI !== "") {
            // Format the valid numeric input with commas for better readability and update state
            setRenderSalary(new Intl.NumberFormat().format(UI)); // Set the formatted salary value
        } else {
            // If input is not a valid number, set the state with the raw input value (which could be a string)
            setRenderSalary(UI); // Set the raw input value (may contain non-numeric characters)
        }
        

        let totalIT = 0
        if (!isNaN(Number(UI))) {
            // Calculate the annual income based on the monthly income (UI)
            let income = Number(UI) * 12; // Convert UI (monthly income) to yearly income

            // Function to calculate income tax based on income brackets
            const incomeTax = (minimum, maximin, val, percent) => {
                let min = minimum; // Minimum income for this bracket
                let max = maximin; // Maximum income for this bracket
                let afterMin = income > min ? income - min : 0; // Income above the minimum threshold
                
                // Calculate monthly tax: if income exceeds the bracket's max, use the fixed value, otherwise apply percentage
                let monthlyTax = afterMin > max ? afterMin = val : Math.round(afterMin * percent / 12); // Calculate tax for the bracket

                // Add the calculated tax to the total income tax
                return totalIT += Number(monthlyTax); // Update total income tax (totalIT)
            }

            // Applying the income tax calculation for different income brackets
            incomeTax(250000, 400000, 1875, 0.15);  // Tax for income between 250,000 and 400,000 with 15% rate
            incomeTax(400000, 400000, 6667, 0.2);   // Tax for income between 400,000 and 400,000 with 20% rate
            incomeTax(800000, 1200000, 25000, 0.25); // Tax for income between 800,000 and 1,200,000 with 25% rate
            incomeTax(2000000, income, 150000, 0.3); // Tax for income above 2,000,000 with 30% rate


            // Calculate Social Security System (SSS) contribution based on income
            let monthlySSSContribution = (income * 0.045) / 12;
            // Cap the SSS contribution at 1350 if it exceeds this limit
            let finalSSSContribution = Math.round(monthlySSSContribution > 1350 ? 1350 : monthlySSSContribution);

            // PhilHealth contribution calculation based on monthly income=
            // Calculate the monthly income from the annual income (income is assumed to be yearly)
            let monthlyIncome = income / 12; // Divide income by 12 to get the monthly value
            // Set the base health amount: if income is below 10,000, the health contribution is set to 500; otherwise, it's the monthly income
            let baseHealthAmount = monthlyIncome < 10000 ? 500 : monthlyIncome; // If income is under 10k, set health contribution to 500
            // Adjust the health amount: if it's not 500 (meaning income is above 10k), apply 5% of the monthly income divided by 2
            let adjustedHealthAmount = baseHealthAmount !== 500 ? Math.round((monthlyIncome * 0.05) / 2) : baseHealthAmount; // 5% of monthly income, halved
            // If income is greater than 100,000, set a maximum health contribution of 5000; otherwise, use the adjusted health amount
            let finalHealthAmount = monthlyIncome > 100000 ? 5000 : adjustedHealthAmount; // Cap health contribution at 5000 if income exceeds 100k
            // Update the state with the calculated contributions and tax values
            
            setMCon(prev => {
                return [
                    {
                        sssContribution: Number(finalSSSContribution), // Assuming finalSSSContribution is calculated elsewhere
                        philHealthContribution: Number(finalHealthAmount), // The final PhilHealth contribution
                        pagIbigContribution: 100,  // Fixed PagIbig contribution (could be adjusted if needed)
                        tax:  Number(totalIT), // The total income tax calculated elsewhere
                        income: Number(income / 12), // Store the monthly income value
                    }
                ]
            });

        }
    }

    let sss = mCon[0].sssContribution;
    let pag = mCon[0].pagIbigContribution;
    let phil = mCon[0].philHealthContribution;
    let tax = mCon[0].tax;
    let Income = mCon[0].income;
    let total = sss + pag + phil

    let totalDeduction = tax + total
    let netPay = Income - totalDeduction

    return (
        <div className='border-4 border-black mt-12 p-4 w-11/12 sm:w-4/5 max-w-screen-2xl flex justify-center items-center flex-col rounded-md shadow-2xl'>
            <h1 className='my-4 text-xl text-center sm:text-3xl font-bold text-blue-800'>Income Tax Calculator</h1>
            <input 
            className='border-2 border-gray-950 p-2 rounded-md max-w-xl w-11/12 sm:w-4/5'
            type="text"
            placeholder='Enter amount'
            onChange={userMonthlySalary}
            value={renderSalary} />

            <div className='border-2 border-gray-950 p-2 rounded-md max-w-xl w-11/12 sm:w-4/5 my-5 sm:my-10'>
                <p className='text-center text-base  sm:text-xl font-semibold'>Income Tax Contribution</p>
                <p className='mt-3 text-sm sm:text-2xl font-medium'>{`Income Tax: ₱ ${mCon[0].tax <= 0 ? "Tax Exempted!" : mCon[0].tax.toLocaleString()} `}</p>
            </div>

            <div className='border-2 border-gray-950 p-2 rounded-md max-w-xl w-11/12 sm:w-4/5 sm:my-10'>
                <p className='text-center text-base  sm:text-xl font-semibold'>Monthly Total Contribution</p>

                <p>{`SSS ₱ ${sss.toLocaleString()}`}</p>
                <p>{`PhilHealth ₱ ${phil.toLocaleString()}`}</p>
                <p>{`Pag-IBIG ₱ ${pag.toLocaleString()}`}</p>
                <p className='mt-4 text-center font-semibold'>{`Total ₱ ${total.toLocaleString()}`}</p>
            </div>

            <div className='border-2 border-gray-950 p-2 rounded-md max-w-xl w-11/12 sm:w-4/5 mt-4 sm:my-10'>
                <p className='text-center text-lg font-bold'>{`Net Pay ${netPay <= 0 ? 0 : netPay.toLocaleString()}`}</p>
            </div>
        </div>
    );
}

export default Incometax;