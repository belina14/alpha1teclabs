function changeSpace(step) {
  const input = document.getElementById("space");
  let value = parseInt(input.value);

  value += step * 100;

  if (value < 100) value = 100;
  if (value > 500) value = 500;   // max value
  input.value = value;

  // update price 
  const price = document.getElementById("price");
  price.textContent = (value / 100) * 5;
}

function updateAccountPrice(accounts) {
  let price = 5;
  if (accounts === 1) {
    price = 5;
  } else if (accounts === 50) {
    price = 95;
  } else {
    for (let i = 5; i <= 45; i += 5) {
      if (accounts <= i) {
        price = i * 2;
        break;
      }
    }
  }

  document.getElementById("emailPrice").textContent = price;
}

function changeAccounts(step) {
  const input = document.getElementById("accounts");
  let value = parseInt(input.value);
  
   if (value === 1 && step === 1) {
    value = 5; 
  } else if (value === 5 && step === -1) {
    value = 1; 
  } else if (value === 50 && step === 1) {
    value = 50; 
  }
    else value += step * 5; 

  // limits
  if (value < 1) {
    value = 1;
  }
  else if (value > 50) value = 50;

  input.value = value;

  updateAccountPrice(value);
  
}