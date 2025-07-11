'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// displaying all the movements of money in an particular account
const displaymovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; // clear previous items first

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//sorting the movement  of transection
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displaymovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// creating unique username for each account
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};
createUsernames(accounts);

// displaying the balance of each account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

// displayin summary of an account
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposite => (deposite * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// dinamically accessing the current account by there pin and user name

const updateUI = function (acc) {
  // display movements
  displaymovements(acc.movements);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

/// adding the login functionality
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // " ? Only access pin if currentAccount is not null or undefined."
    // dislpay UI and message

    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = '';
    inputLoginPin.value = '';

    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

// transfer the amount from one acc to another

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //  transfering money
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

// loan request
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// deleting the account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //deleting the account
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';

  labelWelcome.textContent = `Log in to get started`;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = [1, 2, 3, 4, 5];

// // slice
// console.log(arr.slice(2));
// console.log(arr);
// console.log(arr.slice(2, 4));

// // splice

// console.log(arr.splice(-1));

// //reverse
// const arr2 = [1, 2, 3, 4, 5];
// console.log(arr2.reverse());

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`you deposited ${movement}`);
//   } else {
//     console.log(`you withdraw ${Math.abs(movement)}`);
//   }
// }

// console.log('-----for each -----');

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     console.log(`you deposited ${movement}`);
//   } else {
//     console.log(`you withdraw ${Math.abs(movement)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key} : ${value}`);
// });

// // sets
// const currenciesunique = new Set(['USD', 'EUR', 'EUR', 'GBP']);

// currenciesunique.forEach(function (value, _, map) {
//   console.log(`${value} : ${value}`);
// });

//map methods -----
// const eurToUsd = 1.1;

// const movementUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// console.log(movementUSD);
// console.log(movements);

// filter method-----

// const deposit = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(deposit);

// /// reduce---
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   return acc + curr;
// }, 0); // 0 is the initial value of the acc

// console.log(balance);

// //using arrow function

// const balance2 = movements.reduce((acc, curr) => acc + curr, 0);
// console.log(balance2);

// const max = movements.reduce((acc, curr) => {
//   if (acc > curr) {
//     return acc;
//   } else {
//     return curr;
//   }
// }, movements[0]);

// console.log(max);

// const eurToUsd = 1.1;
// const totaldepositedusd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totaldepositedusd);

/// find method----

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const findacc = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(findacc);

// const lastwithdrawl = movements.findLast(mov => mov < 0);
// console.log(lastwithdrawl);

// flat method
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const accountmovement = accounts.map(acc => acc.movements);

// console.log(accountmovement);
// const allmovements = accountmovement.flat();
// console.log(allmovements);

// const overallbalance = allmovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallbalance);

// // flat map
// const accountmovement1 = accounts.flatMap(acc => acc.movements);

// const overallbalance1 = allmovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallbalance);

//sorting

//ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});

console.log(movements);

//descending
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);
