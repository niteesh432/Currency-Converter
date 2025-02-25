const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for(let select of dropdowns)
{
    for(let currCode in countryList)
    {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name === "from" && currCode==="USD") 
        {
            newOption.selected = "selected";
        }
        else if(select.name === "to" && currCode==="INR") 
        {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    })
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

const updateExchangeRate = async () => {
    let amount = document.querySelector("#amount");
    let amtVal = amount.value;
    if (amtVal === "" || amtVal < 1)
    {
        amtVal = 1;
        amount.value = "1";
    }

    let response = await fetch(BASE_URL);
    let data = await response.json();

    let fromCurrency = fromCurr.value.toLowerCase();
    let toCurrency = toCurr.value.toLowerCase();
    let rate;

    if (fromCurrency === "usd") 
    {
        rate = data["usd"][toCurrency];  // Accessing nested data
    } 
    else if (toCurrency === "usd")
    {
        rate = 1 / data["usd"][fromCurrency];  // Convert to USD first
    } 
    else 
    {
        // Convert from the source currency to USD, then from USD to the target currency
        const fromRate = data["usd"][fromCurrency];
        const toRate = data["usd"][toCurrency];
        rate = toRate / fromRate;
        /*for example we want to convert 1 EURO to 1 INR then Here USD acting as intermediary.
        so, 1 USD = 0.92 EURO and 1 USD = 83.99 INR then, 0.92 EURO = 83.99 INR. so, for 0.92 EURO = 83.99 INR then 1 EURO = ? INR.
        doing cross multiplication, (83.99/0.92) = 91.29.*/
    }
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
}


// Assuming you have already defined BASE_URL, fromCurr, and toCurr

btn.addEventListener("click", async (evt) =>{
        evt.preventDefault();
        updateExchangeRate();
});

window.addEventListener("load",() =>{
    updateExchangeRate();
})

