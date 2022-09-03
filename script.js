// SELECTORS
const form = document.querySelector('.registration-form')
const firstName = document.querySelector('#firstName')
const lastName = document.querySelector('#lastName')
const dob = document.querySelector('#dob');
const email = document.querySelector('#email')
const phone = document.querySelector('#phone')
const maritalStatus = document.querySelector('input[name="marital"]:checked')
const street = document.querySelector('#street')
const city = document.querySelector('#city')
const state = document.querySelector('#state')
const zip = document.querySelector('#zip')
const country = document.querySelector('#country')
const coursesAvailable = document.querySelector('.courses-available')
const coursesCheckbox = document.querySelector('.course-checkbox')
const education = document.querySelector('#education')
const major = document.querySelector('#major')
const gpa = document.querySelector('#gpa')
const yearGraduated = document.querySelector('#yearGraduated');
const prediscountTotal = document.querySelector('#prediscountTotal')
const coursesFeeContainer = document.querySelector('.courses-fee-container')
const discountsContainer = document.querySelector('.discounts-container')
const tax = document.querySelector('#tax')
const grandTotal = document.querySelector('#grandTotal')
const registration = document.querySelector('#registration')
const checkout = document.querySelector('#checkout')
const backBtn = document.querySelector('#backBtn')
const resetBtn = document.querySelector('#resetBtn')

// TAX RATE
const TAX_RATE = 6.5

// COURSE PRICES
const COURSES = [
  { name: 'MERN', price: 4750 },
  { name: 'PYTHON', price: 3250 },
  { name: 'SQL', price: 1500 },
  { name: 'JAVA', price: 4000 },
  { name: 'OTHERS', price: 3000 },
]

// EVENT LISTENERS
form.addEventListener('submit', submit)
backBtn.addEventListener('click', goBack)
resetBtn.addEventListener('click', () => { form.reset() })

function submit(e) {
  e.preventDefault()

  // THIS SHOULD SHOW THE CHECKOUT PAGE AFTER CLICKING SUBMIT AND HIDE THE FORM
  registration.classList.add('hidden')
  checkout.classList.remove('hidden')

  // EVERYTIME WE SUBMIT, DATA WILL RESET (AKA WIPED) BECAUSE WE SUBMIT OUR FORM 
  resetCoursesSelected()
  renderTotalTable()
  renderDiscountsTable()
}

// RENDERING COURSES TO THE DOM
function renderCoursesCheckboxes() {
  // LOOPING THROUGH COURSES ARRAY TO RENDER EACH ONE TO THE DOM 
  COURSES.forEach(course => {
    // dynamically creating the div, checkbox, and label...
    const checkboxDiv = document.createElement('div')
    const checkbox = document.createElement('input')
    const label = document.createElement('label')
  
    checkboxDiv.classList.add('checkbox-field')
    checkbox.classList.add('course-checkbox')
  
    checkbox.setAttribute('type', 'checkbox')
    checkbox.setAttribute('data-course-name', course.name)
    checkbox.setAttribute('value', course.price)
    label.innerText = course.name

    checkboxDiv.appendChild(checkbox)
    checkboxDiv.appendChild(label)

    coursesAvailable.appendChild(checkboxDiv)
  })
}

function renderTotalTable() {
  const selectedCourses = getSelectedCourses()
  if (selectedCourses.length) {
    selectedCourses.forEach(course => {
      const courseDiv = document.createElement('div')
      const courseTitleSpan = document.createElement('span')
      const coursePriceSpan = document.createElement('span')
  
      courseDiv.classList.add('course')
      courseTitleSpan.classList.add('course-title')
      coursePriceSpan.classList.add('course-price')
  
      courseTitleSpan.innerText = course.getAttribute('data-course-name')
      coursePriceSpan.innerText = `$${course.value}`
  
      courseDiv.appendChild(courseTitleSpan)
      courseDiv.appendChild(coursePriceSpan)

      coursesFeeContainer.appendChild(courseDiv)
    })
  
    // UPDATING TOTAL PRICE IN HTML
    prediscountTotal.innerText = `$${getTotalPrice()}` 
  }
}

// DISCOUNTS DISCOUNTS DISCOUNTS! 
function renderDiscountsTable() {
  const discounts = getDiscounts()

  discounts.forEach(discount => {
    const discountDiv = document.createElement('div')
    const discountLabelSpan = document.createElement('span')
    const priceContainerDiv = document.createElement('div')
    const percentageSpan = document.createElement('span')
    const priceSpan = document.createElement('span')
    const discountedPriceSpan = document.createElement('span')

    discountDiv.classList.add('discount')
    discountLabelSpan.classList.add('discount-title')
    priceContainerDiv.classList.add('discounted-price-container')
    percentageSpan.classList.add('discount-percentage')
    priceSpan.classList.add('pre-discounted-price')
    discountedPriceSpan.classList.add('discounted-price')

    discountLabelSpan.innerText = discount.label
    percentageSpan.innerText = `${discount.percentage}% OFF `
    priceSpan.innerText = `$${discount.total.toFixed(2)} `
    discountedPriceSpan.innerText = `$${discount.discountedTotal.toFixed(2)}`

    priceContainerDiv.appendChild(percentageSpan)
    priceContainerDiv.appendChild(priceSpan)
    priceContainerDiv.appendChild(discountedPriceSpan)

    discountDiv.appendChild(discountLabelSpan)
    discountDiv.appendChild(priceContainerDiv)

    discountsContainer.appendChild(discountDiv)
  })
}

function getDiscounts() {
  const preferredTiming = document.querySelector('input[name="timing"]:checked')
  const discounts = []
  let total = getTotalPrice()

  // 3% DISCOUNT FOR MORNING CLASS
  if (preferredTiming && preferredTiming.value === 'morning' || preferredTiming.value === 'evening') {
    const discount = {
      label: 'Selected Morning or Evening Time',
      percentage: 3,
      total,
      discountedTotal: total - (total * 3) / 100,
    }

    discounts.push(discount)
    total = discount.discountedTotal
  }

  // 10% discount if both SQL and JAVA are selected
  if (containsCourse('SQL') && containsCourse('JAVA')) {
    const discount = {
      label: 'Selected both SQL and JAVA classes',
      percentage: 10,
      total,
      discountedTotal: total - (total * 10) / 100,
    }

    discounts.push(discount)
    total = discount.discountedTotal
  }

  // 5% discount if from NY
  if (state.value === 'WA') {
    const discount = {
      label: 'WA State Discount',
      percentage: 5,
      total,
      discountedTotal: total - (total * 5) / 100,
    }

    discounts.push(discount)
    total = discount.discountedTotal
  }

  // 10% discount if undergrad GPA is greater than 3.25
  if (education.value === 'Undergrad' && parseFloat(gpa.value) > 3.5) {
    const discount = {
      label: 'Undergrad GPA > 3.5',
      percentage: 10,
      total,
      discountedTotal: total - (total * 10) / 100,
    }

    discounts.push(discount)
    total = discount.discountedTotal
  }

  renderGrandTotal(discounts)

  // here we're returning an iterable array which will eventually be looped and rendered to the DOM
  // in renderDiscountsTable()
  return discounts
}

function renderGrandTotal(discounts) {
  let totalPrice = 0
  let totalTax = 0

  // If we have any discounts, then get the latest discount's total
  if (discounts && discounts.length > 0) {
    const { discountedTotal } = discounts[discounts.length - 1] // subtract one to get last elements
    totalTax = (discountedTotal * TAX_RATE) / 100
    totalPrice = discountedTotal + totalTax
  } else {
    // ... otherwise if there aren't any discounts, we'll just grab the regular total price
    const total = getTotalPrice()
    totalTax = (total * TAX_RATE) / 100
    totalPrice = total + totalTax
  }

  tax.innerText = `$${totalTax.toFixed(2)}`
  grandTotal.innerText = `$${totalPrice.toFixed(2)}`
}

function getSelectedCourses() {
  const selectedCourses = document.querySelectorAll('.course-checkbox:checked')
  return Array.from(selectedCourses)
}

// GETTING SELECTED COURSENAME IN AN ARRAY
function containsCourse(courseName) {
  const selectedCourses = getSelectedCourses()
  const courseNames = selectedCourses.map(course => course.getAttribute('data-course-name'))
  return courseNames.includes(courseName)
}

// LOOPING THROUGH THE SELECTED COURSES AND TOTAL UP AND RETURN THE PRICE
function getTotalPrice() {
  const selectedCourses = getSelectedCourses()
  let total = 0

  selectedCourses.forEach(course => {
    total += parseInt(course.value)
  })

  return total
}

function populateYearsDropdown(el) {
  let currentYear = new Date().getFullYear();
  let earliestYear = 1970;
  
  while (currentYear >= earliestYear) {
    let dateOption = document.createElement('option');
    dateOption.text = currentYear;
    dateOption.value = currentYear;
    el.add(dateOption);
    currentYear -= 1;
  }
}

// UTILIZING VANILLA JS DATEPICKER PLUGIN BY PASSING THE DOB INPUT SECTION 
function initDatePicker() {
  new Datepicker(dob, {});
}

function resetCoursesSelected() {
  coursesFeeContainer.innerHTML = ''
  discountsContainer.innerHTML = ''
  prediscountTotal.innerHTML = '$0.00'
  grandTotal.innerHTML = '$0.00'
  tax.innerHTML = '$0.00'
}

function goBack() {
  registration.classList.remove('hidden')
  checkout.classList.add('hidden')
}

// CALLING FUNCTIONS UPON LANDING ON THIS PAGE
renderCoursesCheckboxes()
populateYearsDropdown(yearGraduated)
initDatePicker()