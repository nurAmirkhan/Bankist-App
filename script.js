'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

//// Different data

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  ///.textContent = 0.

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; ///sorting function

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html); ///beforebegin/afterbegin/beforeend/afterend
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => int + acc, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUi = function (acc) {
  //// DISPLAY MOVEMENTS
  displayMovements(acc.movements);
  ////DISPLAY BALANCE
  calcDisplayBalance(acc);
  ////DISPLAY SUMMARY
  calcDisplaySummary(acc);
};

//// Event handlers

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  ///prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (
    currentAccount?.pin &&
    currentAccount.pin === Number(inputLoginPin.value)
  ) {
    //// DISPLAY UI AND WELCOME MESSAGE
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    /// Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); /// to remove the cursor from the pin
    /// UPDATE UI
    updateUi(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    /// ADD MOVEMENT
    currentAccount.movements.push(amount);
  }
  /// UPDATE UI
  updateUi(currentAccount);
  inputLoanAmount.value = '';
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    /// Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //.indexof(23)
    accounts.splice(index, 1);
    /// Hide UI
    containerApp.style.opacity = 0;
  }
  /// Deleting the values at 'Close Account' area
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);

  sorted = !sorted;
});
/*
  
  /////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


/////////////////////////////////////////////////
let arr = ['a', 'b', 'c', 'd', 'e'];

////// Slice method - does not mutates the original array
arr.slice(2);
console.log(arr.slice(2));
console.log(arr.slice(2, 4)); // end parameter is not included in the output

console.log(arr.slice(-2, -1));
console.log(arr.slice(1, -2));
console.log(arr.slice()); // all items in the array
console.log([...arr]); // all items in the array

/// Splice method - splice mutates the original array
//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

/// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse()); // it does mutate the array
console.log(arr2);

/// CONCAT

const letters = arr.concat(arr2); // - doesn't mutate the array
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));

// Push, Shift, Unshift, pop, indexof, includes
/// Slice,Splice,concat,join, ...
/// array methods


/// AT method
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

console.log(arr[arr.length - 1]); // getting the last element from the array
console.log(arr.slice(-1)[0]); // same as above

console.log(arr.at(-1)); // getting the last element in the array ( modern way)

console.log('jonas'.at(0)); /// will return j
console.log('jonas'.at(-1)); // will return s


////// FOR EACH

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const [i, move] of movements.entries()) {
  //for (const move of movements) {
  move > 0
    ? console.log(`Movement ${i + 1} You've deposited ${move}`)
    : console.log(`Movement ${i + 1}You withdrew ${Math.abs(move)}`);
}

console.log('--- FOR EACH ---');
movements.forEach(function (mov, i, arr) {
  mov > 0
    ? console.log(`Movement ${i + 1} :You've deposited ${mov}`)
    : console.log(`Movement ${i + 1}:You withdrew ${Math.abs(mov)}`);
});
/// Parameters of the FOR EACH function should be (parameter of the function, index, array)
// 0: function (200)
// 1: function (450)
// 2: function (400)
// ...
/// CONTINUE AND BREAK WORDS DOES NOT WORK WITH FOR EACH LOOP

//// FOR EACH FOR MAPS
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} : ${value}`);
});

//// FOR EACH FOR SETS

const currenciesUnique = new Set(['USD', 'GPB', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value} : ${value}`);
});


//// CODING CHALLENGE # 1 ////
///Julia's data [3,5,2,12,7] | Kate's [4,1,15,8,3]

///Julia's data [9,16,6,8,3] | Kate's [10,5,6,1,4]

const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const dogsJulia2 = [9, 16, 6, 8, 3];
const dogsKate2 = [10, 5, 6, 1, 4];

const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCopy = dogsJulia.slice(1, -2);
  const allDogs = [...dogsJuliaCopy, ...dogsKate];
  //console.log(allDogs);

  allDogs.forEach(function (age, i) {
    age >= 3
      ? console.log(`Dog number ${i + 1} is an adult,and it's ${age} years old`)
      : console.log(`Dog number ${i + 1} is still a puppy`);
  });
};
checkDogs(dogsJulia, dogsKate);
console.log(`----TEST SET 2 -----`);
checkDogs(dogsJulia2, dogsKate2);


////// MAP - FILTERS - REDUCE
// MAP - LOOPS OVER THE ARRAY AND CREATED NEW ARRAY WITH NEW VALUES (MORE USEFUL THAN 'FOR EACH' METHOD)
// FILTER - FITER FOR ELEMENTS IN THE ORIGINAL ARRAY AND RETURNS NEW ARRAY CONTAINING THE ARRAY ELEMENTS THAT PASSED A SPECIFIED TEST CONDITION
// REDUCE - BOILS ALL ARRAY ALEMENTS DOWN TO ONE SINGLE VALUE (E.G ADDING ALL ELEMENTS TOGETHER) (NEEDS ACCUMULATOR VALUE)


//// MAP METHOD ///////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * eurToUsd);
}
console.log(movementsUSDfor);

const movementsDescriptions = movements.map(
  (mov, i) =>
    `Movement ${i + 1} :You've ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDescriptions);

//// FILTER METHOD /////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/// filter out the positive values
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(function (movs) {
  return movs < 0;
});
console.log(withdrawals);

// const withdrawals = movements.filter ( mov => mov < 0);


/// REDUCE METHOD ///

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/// accumulator -> snowBall
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Itiration ${i}: ${acc}`);
  return acc + cur;
}, 0);
//// 0 is the initial value of the first loop of the accumulator
console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

//const balance1 = movements.reduce((acc, cur) => acc + cur, 0);
//console.log(balance1);

//// Maximum value ///
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);

console.log(max);


//// Coding Challenge #2 ///

/// TEST data 1 [5,2,4,1,15,8,3]

///Julia's data [16,6,5,6,1,4]

const testdata1 = [5, 2, 4, 1, 15, 8, 3];
const testdata2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = function (ages) {
  const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(humanAge);

  const adults = humanAge.filter(num => num >= 18);
  console.log(adults);

  const avgAge = adults.reduce((acc, cur) => acc + cur, 0) / adults.length;
  return avgAge;
};

const data1 = calcAverageHumanAge(testdata1);
const data2 = calcAverageHumanAge(testdata2);

console.log(data1, data2);

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// })


//// CHAINING METHODS ///// PIPELINE
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUSD = 1.1;
const totalDepositsInUSDmovements = movements
  .filter(mov => mov > 0)
  //.map(mov => mov * eurToUSD)
  .map((mov, i, arr) => {
    //console.log(arr);
    return mov * eurToUSD;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsInUSDmovements);

//// WE CAN ONLY CHAIN METHODS IF ITS RELATED TO THE ARRAYS

//// Coding challenge # 3 ///

const testdata1 = [5, 2, 4, 1, 15, 8, 3];
const testdata2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge2 = function (ages) {
  const avgAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  return avgAge;
};
const data1 = calcAverageHumanAge2(testdata1);
const data2 = calcAverageHumanAge2(testdata2);

console.log(data1, data2);


////// THE FIND METHOD ////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/// FIND METHOD LOOPS OVER THE ARRAY
/// FILTER REDUCE ALL THE ELEMENTS THAT MATCHES THE CONDITIONS
//// FIND METHOD FINDS THE FIRST ONE
///// FIND RETURNS THE ELEMENT ITSELF,NOT THE ARRAY
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

const account = accounts.find(acc => acc.owner === 'Jessica Davies');
console.log(account);


//// SOME AND EVERY ////

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///// EQUALITY
console.log(movements.includes(-130));

/// CONDITION
console.log(movements.some(mov => mov === -130));

const anyDeposits = movements.some(mov => mov > 1000);
console.log(anyDeposits);
//// Checks if there are any deposits more than 1000.


///// EVERY /////
/// Checking if all out movements are deposits
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

/// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


///// FLAT and FLATMAP Method ////
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());
///// returns [1, 2, 3, 4, 5, 6, 7, 8]
const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2)); /// NUMBER DEFINES THE LVLS OF NESTING

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allaccountMovements = accountMovements.flat();
// console.log(allaccountMovements);
// const overallBalance = allaccountMovements.reduce((acc, cur) => acc + cur, 0);
// console.log(overallBalance);

//// FLAT ///
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalance);

/// FLATMAP /// ONLY GOES ONE LEVEL DEEP
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, cur) => acc + cur, 0);
console.log(overallBalance);

/// IF NEEDED TO GO >1 LEVEL DOWN, still need to use separate flattening.


const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];

console.log(owners.sort()); ///Mutates the originally array
console.log(owners); /// mutated

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

// return < 0, A,B (keep order) return negative
// return > 0, B,A (switch order) return positive

///Ascending order
movements.sort((a, b) => a - b);
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
console.log(movements);
///Descending order
movements.sort((a, b) => b - a);
//   if (a > b) return -1;
//   if (a < b) return 1;
// });
console.log(movements);


const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7); ///created empty array with 7 empty values
console.log(x);

x.fill(1, 3, 5); ///Mutate the underlying array | second number define the position from where to start | third number defined the position where to end
x.fill(1);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

/// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

/// Randon Dice Array
const randomDice = Array.from({ length: 100 }, (_, i) =>
  Math.floor(Math.random(i + 1) * 101)
);
console.log(randomDice);

// const movementsUI = Arrat.from(document.querySelectorAll('.movements_value'));
// console.log(movementsUI);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('.movements__value')]; /// second option to use, but need to do the mapping separately
});

///////////////////////////////////////////
//Practice Array Methods
//#1
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);

console.log(bankDepositSum);

// #3
// const depositCount = accounts
//   .flatMap(acc => acc.movements)
//   .filter((mov, arr) => mov >= 1000).length;

const depositCount = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur > 1000 ? ++count : count), 0);

console.log(depositCount);

///Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

/// #3 REDUCE METHOD WITH OBJECTS
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      //cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

//#4 this is a nice title => This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => srt[0].toUpperCase() + word.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG nice title, but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

///////////////////////////////////////////
// Coding Challenge #4

const dog = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
console.log(dog[1].weight);

dog.forEach(dog => (dog.recFood = Math.floor(dog.weight ** 0.75 * 28))); //onst includesSarah = dog.owners.includes('Sarah');
console.log(dog);

const dogSarah = dog.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);

const compareFood = function () {
  if (dogSarah.curFood > dogSarah.recFood) {
    console.log(`Dog Eating Too much`);
  } else {
    console.log(`Dog is eating too little`);
  }
};
compareFood(dogSarah);

const tooMuch = dog
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
console.log(tooMuch);

const tooLittle = dog
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(tooLittle);

///4.
//"Matilda and Alice and Bob's dogs eat too much!"
// "Sarah and John and Michael's dogs eat too little!"

console.log(`${tooMuch.join(' and ')} dogs eat too much!`);
console.log(`${tooLittle.join(' and ')} dogs eat too little!`);

//  #5
console.log(dog.some(dog => dog.curFood === dog.recFood));

// #6
// current >(recommended * 0.90) && current <(recommended *1.10)
const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(checkEatingOkay(dog));
// #7
console.log(dog.filter(checkEatingOkay));
// #8

///Ascending order
//movements.sort((a, b) => a - b);
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

const dogSorted = dog.slice().sort((a, b) => a.recFood - b.recFood);
console.log(dogSorted);
