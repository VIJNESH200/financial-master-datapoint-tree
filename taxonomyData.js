// taxonomyData.js - WHAT financial items exist.
//
// This file holds the entire financial taxonomy used by the app. Each item has:
//   name      = text displayed on the webpage (e.g. "Cost of Goods Sold").
//   datapoint = datapoint code shown in [brackets] (e.g. "Cost_Of_Goods_Sold").
//               Used by search, the copy button, and the detail panel.
//   children  = child items nested underneath this item (optional).
//               A + / - toggle appears ONLY when children exist, so a parent
//               may still carry its own datapoint code AND have children.
//   isSide    = balance-sheet layout hint ("assets" or "liabilitiesEquity");
//               leave it as-is, it only affects styling.
//
// How to ADD a new datapoint (leaf, no children):
//   { name: "Cash & Cash Equivalents", datapoint: "Cash_And_Cash_Equivalents" },
//
// How to ADD a child under an existing datapoint:
//   { name: "Current Assets", datapoint: "Current_Assets", children: [
//       { name: "Cash & Cash Equivalents", datapoint: "Cash_And_Cash_Equivalents" }
//   ] },
//
// Then add a matching definition in definitions.js under the same code.
//
// Do NOT edit script.js when only adding, removing, or changing taxonomy -
// the tree, search, counts, and detail panel all follow this file automatically.
const financialData = {
  gind: {
    balanceSheet: [
      {
        name: "Assets",
        datapoint: "Total_Assets",
        isSide: "assets",
        children: [
          {
            name: "Current Assets",
            datapoint: "Current_Assets",
            children: [
              { name: "Cash & Cash Equivalents", datapoint: "Cash_And_Cash_Equivalents" },
              { name: "Accounts Receivable", datapoint: "Accounts_Receivable" },
              { name: "Inventory", datapoint: "Inventory" },
              { name: "Other Current Assets", datapoint: "Other_Current_Assets" }
            ]
          },
          {
            name: "Non-Current Assets",
            datapoint: "Non_Current_Assets",
            children: [
              { name: "Property, Plant & Equipment", datapoint: "Property_Plant_Equipment" },
              {
                name: "Intangible Assets",
                datapoint: "Intangible_Assets",
                children: [
                  { name: "Goodwill", datapoint: "Goodwill" },
                  { name: "Other Intangible Assets", datapoint: "Other_Intangible_Assets" }
                ]
              },
              { name: "Other Non-Current Assets", datapoint: "Other_Non_Current_Assets" }
            ]
          }
        ]
      },
      {
        name: "Total Liabilities & Equity",
        isSide: "liabilitiesEquity",
        datapoint: "Total_Liabilities_And_Equity",
        children: [
          {
            name: "Liabilities",
            datapoint: "Total_Liabilities",
            children: [
              {
                name: "Current Liabilities",
                datapoint: "Current_Liabilities",
                children: [
                  { name: "Accounts Payable", datapoint: "Accounts_Payable" },
                  { name: "Short-Term Debt", datapoint: "Short_Term_Debt" },
                  { name: "Other Current Liabilities", datapoint: "Other_Current_Liabilities" }
                ]
              },
              {
                name: "Non-Current Liabilities",
                datapoint: "Non_Current_Liabilities",
                children: [
                  { name: "Long-Term Debt", datapoint: "Long_Term_Debt" },
                  { name: "Deferred Tax Liabilities", datapoint: "Deferred_Tax_Liabilities" },
                  { name: "Other Non-Current Liabilities", datapoint: "Other_Non_Current_Liabilities" }
                ]
              }
            ]
          },
          {
            name: "Equity",
            datapoint: "Total_Equity",
            children: [
              { name: "Share Capital", datapoint: "Share_Capital" },
              { name: "Retained Earnings", datapoint: "Retained_Earnings" },
              { name: "Other Equity", datapoint: "Other_Equity" }
            ]
          }
        ]
      }
    ],
    incomeStatement: [
      {
        name: "Revenue",
        datapoint: "Revenue",
        children: [
          { name: "Product / Service Revenue", datapoint: "Product_Service_Revenue" },
          { name: "Other Operating Revenue", datapoint: "Other_Operating_Revenue" }
        ]
      },
      {
        name: "Cost of Sales",
        datapoint: "Cost_Of_Sales",
        children: [
          { name: "Cost of Goods Sold", datapoint: "Cost_Of_Goods_Sold" },
          { name: "Other Cost of Sales", datapoint: "Other_Cost_Of_Sales" }
        ]
      },
      { name: "Gross Profit", datapoint: "Gross_Profit" },
      {
        name: "Operating Expenses",
        datapoint: "Operating_Expenses",
        children: [
          { name: "Selling, General & Administrative", datapoint: "Selling_General_Administrative" },
          { name: "Research & Development", datapoint: "Research_And_Development" },
          { name: "Other Operating Expenses", datapoint: "Other_Operating_Expenses" }
        ]
      },
      { name: "EBITDA", datapoint: "EBITDA" },
      { name: "Depreciation & Amortization", datapoint: "Depreciation_And_Amortization" },
      { name: "EBIT / Operating Profit", datapoint: "EBIT" },
      {
        name: "Non-Operating Income / Expense",
        datapoint: "Non_Operating_Income_Expense",
        children: [
          { name: "Interest Income", datapoint: "Interest_Income" },
          { name: "Interest Expense", datapoint: "Interest_Expense" },
          { name: "Other Non-Operating Income / Expense", datapoint: "Other_Non_Operating_Income_Expense" }
        ]
      },
      { name: "Profit Before Tax", datapoint: "Profit_Before_Tax" },
      { name: "Tax", datapoint: "Income_Tax" },
      { name: "Net Profit", datapoint: "Net_Profit" }
    ],
    cashFlow: [
      {
        name: "Cash Flow From Operations",
        datapoint: "Cash_Flow_From_Operations",
        children: [
          { name: "Net Income", datapoint: "Net_Income" },
          { name: "Depreciation & Amortization", datapoint: "Depreciation_And_Amortization" },
          { name: "Changes In Working Capital", datapoint: "Changes_In_Working_Capital" },
          { name: "Other Operating Adjustments", datapoint: "Other_Operating_Adjustments" }
        ]
      },
      {
        name: "Cash Flow From Investing",
        datapoint: "Cash_Flow_From_Investing",
        children: [
          { name: "Capital Expenditure", datapoint: "Capital_Expenditure" },
          { name: "Acquisitions", datapoint: "Acquisitions" },
          { name: "Investments", datapoint: "Investments" },
          { name: "Other Investing Activities", datapoint: "Other_Investing_Activities" }
        ]
      },
      {
        name: "Cash Flow From Financing",
        datapoint: "Cash_Flow_From_Financing",
        children: [
          { name: "Debt Issuance", datapoint: "Debt_Issuance" },
          { name: "Debt Repayment", datapoint: "Debt_Repayment" },
          { name: "Share Issuance", datapoint: "Share_Issuance" },
          { name: "Share Buybacks", datapoint: "Share_Buybacks" },
          { name: "Dividends", datapoint: "Dividends" },
          { name: "Other Financing Activities", datapoint: "Other_Financing_Activities" }
        ]
      },
      { name: "Net Change In Cash", datapoint: "Net_Change_In_Cash" },
      { name: "Cash & Cash Equivalents At Beginning Of Period", datapoint: "Cash_And_Cash_Equivalents_At_Beginning" },
      { name: "Cash & Cash Equivalents At End Of Period", datapoint: "Cash_And_Cash_Equivalents_At_End" }
    ]
  },

  bank: {
    balanceSheet: [
      {
        name: "Assets",
        datapoint: "Bank_Total_Assets",
        isSide: "assets",
        children: [
          { name: "Cash & Balances with Central Banks", datapoint: "Cash_Balances_Central_Banks" },
          { name: "Loans & Advances to Banks", datapoint: "Loans_Advances_Banks" },
          { name: "Loans & Advances to Customers", datapoint: "Loans_Advances_Customers" },
          { name: "Investment Securities", datapoint: "Investment_Securities" },
          { name: "Derivative Financial Assets", datapoint: "Derivative_Financial_Assets" },
          { name: "Property and Equipment", datapoint: "Bank_Property_Equipment" },
          { name: "Other Bank Assets", datapoint: "Other_Bank_Assets" }
        ]
      },
      {
        name: "Total Liabilities & Equity",
        isSide: "liabilitiesEquity",
        datapoint: "Bank_Total_Liabilities_And_Equity",
        children: [
          {
            name: "Liabilities",
            datapoint: "Bank_Total_Liabilities",
            children: [
              { name: "Deposits from Banks", datapoint: "Deposits_From_Banks" },
              { name: "Customer Accounts & Deposits", datapoint: "Customer_Deposits" },
              { name: "Debt Securities in Issue", datapoint: "Debt_Securities_Issued" },
              { name: "Derivative Financial Liabilities", datapoint: "Derivative_Financial_Liabilities" },
              { name: "Subordinated Debt", datapoint: "Subordinated_Debt" },
              { name: "Other Bank Liabilities", datapoint: "Other_Bank_Liabilities" }
            ]
          },
          {
            name: "Equity",
            datapoint: "Bank_Total_Equity",
            children: [
              { name: "Share Capital", datapoint: "Bank_Share_Capital" },
              { name: "Retained Earnings", datapoint: "Bank_Retained_Earnings" },
              { name: "Reserves & Other Equity", datapoint: "Bank_Reserves" }
            ]
          }
        ]
      }
    ],
    incomeStatement: [
      { name: "Interest Income", datapoint: "Interest_Income" },
      { name: "Interest Expense", datapoint: "Bank_Interest_Expense" },
      { name: "Net Interest Income", datapoint: "Net_Interest_Income" },
      {
        name: "Non-Interest Income",
        datapoint: "Non_Interest_Income",
        children: [
          { name: "Fees & Commissions", datapoint: "Net_Fee_Commission_Income" },
          { name: "Trading Income", datapoint: "Trading_Fair_Value_Income" },
          { name: "Other Non-Interest Income", datapoint: "Bank_Other_Operating_Income" }
        ]
      },
      {
        name: "Credit Loss Expense / Loan Loss Provisions",
        datapoint: "Credit_Loss_Expense",
        children: [
          { name: "Loan Loss Provisions", datapoint: "Loan_Loss_Provisions" },
          { name: "Impairment Charges", datapoint: "Credit_Impairment_Charges" }
        ]
      },
      {
        name: "Operating Expenses",
        datapoint: "Operating_Expenses",
        children: [
          { name: "Staff Expenses", datapoint: "Staff_Expenses" },
          { name: "Administrative Expenses", datapoint: "Administrative_Expenses" },
          { name: "Other Operating Expenses", datapoint: "Other_Operating_Expenses" }
        ]
      },
      { name: "Profit Before Tax", datapoint: "Profit_Before_Tax" },
      { name: "Tax", datapoint: "Bank_Taxation" },
      { name: "Net Profit", datapoint: "Net_Profit" }
    ],
    cashFlow: [
      {
        name: "Cash Flow From Operations",
        datapoint: "Cash_Flow_From_Operations",
        children: [
          { name: "Operating Profit Before Tax", datapoint: "Bank_CF_Operating_Profit" },
          { name: "Adjustments for Non-Cash Items", datapoint: "Bank_CF_Non_Cash_Adjustments" },
          { name: "Change in Loans & Advances", datapoint: "Bank_CF_Change_In_Loans" },
          { name: "Change in Customer Deposits", datapoint: "Bank_CF_Change_In_Deposits" }
        ]
      },
      {
        name: "Cash Flow From Investing",
        datapoint: "Cash_Flow_From_Investing",
        children: [
          { name: "Purchase of Investment Securities", datapoint: "Bank_CF_Investment_Securities_Purchase" },
          { name: "Proceeds from Investment Securities", datapoint: "Bank_CF_Investment_Securities_Proceeds" },
          { name: "Capital Expenditure on Fixed Assets", datapoint: "Bank_CF_Capex" }
        ]
      },
      {
        name: "Cash Flow From Financing",
        datapoint: "Cash_Flow_From_Financing",
        children: [
          { name: "Issuance of Subordinated Debt", datapoint: "Bank_CF_Subordinated_Debt_Issued" },
          { name: "Repayment of Subordinated Debt", datapoint: "Bank_CF_Subordinated_Debt_Repaid" },
          { name: "Dividends Paid", datapoint: "Bank_CF_Dividends_Paid" }
        ]
      },
      { name: "Net Change In Cash", datapoint: "Net_Change_In_Cash" },
      { name: "Cash & Cash Equivalents At Beginning Of Period", datapoint: "Cash_And_Cash_Equivalents_At_Beginning" },
      { name: "Cash & Cash Equivalents At End Of Period", datapoint: "Cash_And_Cash_Equivalents_At_End" }
    ]
  },

  supplementaryItems: [
    { name: "Earnings Per Share", datapoint: "EPS" },
    { name: "Diluted Earnings Per Share", datapoint: "Diluted_EPS" },
    { name: "Dividend Per Share", datapoint: "DPS" },
    { name: "Book Value Per Share", datapoint: "Book_Value_Per_Share" },
    { name: "Tangible Book Value Per Share", datapoint: "Tangible_Book_Value_Per_Share" },
    { name: "Weighted Average Shares Outstanding", datapoint: "Weighted_Average_Shares_Outstanding" },
    { name: "Diluted Weighted Average Shares Outstanding", datapoint: "Diluted_Weighted_Average_Shares_Outstanding" },
    { name: "Dividend Payout", datapoint: "Dividend_Payout" }
  ]
};

// Lets Node load this file for quick checks (ignored by the browser).
if (typeof module !== "undefined" && module.exports) {
  module.exports = { financialData };
}
