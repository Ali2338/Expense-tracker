import { data } from "react-router-dom";
import moment from "moment"

export const validateEmail = (email) => {
    const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Regex.test(email);
}

export const getInitials = (name) => {
    if (!name) return "";  // Return empty string if no name provided
    
    const words = name.trim().split(/\s+/);  // Split on one or more spaces
    let initials = "";
    
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];  // Add first character of each word
    }
    
    return initials.toUpperCase();  // Ensure the initials are uppercase
};


export const addThousandSeparator = (num) => {
    if (num === null || isNaN(num)) return "";
    const[integerPart,fractionalPart] = num.toString().split(".");
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
}

export const prepareExpenseBarChartData = (data = []) => {

    const ChartData = data.map((item)=>({
        category: item?.category,
        amount : item?.amount,
    }));
    return ChartData;
};

export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const ChartData = sortedData.map((item) => ({
        month: moment(item?.date).format('Do MMM'),
        amount: item?.amount,
        source: item.source,
    }));

    return ChartData;
}

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const ChartData = sortedData.map((item) => ({
        month: moment(item?.date).format('Do MMM'),
        amount: item?.amount,
        category: item.category,
    }));

    return ChartData;
}