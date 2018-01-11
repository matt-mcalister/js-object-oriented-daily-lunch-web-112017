function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const store = {
  "deliveries": [],
  "meals":[],
  "customers":[],
  "employers":[]
}

const Delivery = (function () {
  let id = 0;
  return class {
    constructor(meal = {}, customer = {}) {
      this.customerId = customer.id;
      this.mealId = meal.id;
      this.id = ++id;
      store.deliveries.push(this);
    }

    meal(){
      return store.meals.find(function(meal){return meal.id === this.mealId}.bind(this));
    }

    customer(){
      return store.customers.find(function(customer){return customer.id === this.customerId}.bind(this));
    }
  }
})()

const Meal = (function () {
  let id = 0;
  return class {
    constructor(title, price) {
      this.title = title;
      this.price = price;
      this.id = ++id;
      store.meals.push(this);
    }

    static byPrice() {
      return store.meals.sort(function(a,b){return b.price - a.price})
    }

    deliveries(){
      return store.deliveries.filter(function(delivery){
        return delivery.mealId === this.id}.bind(this)
      )
    }

    customers(){
      return this.deliveries().map(function(delivery){
        return delivery.customer();
      })
    }
  }
})()

const Employer = (function () {
  let id = 0;
  return class {
    constructor(name) {
      this.name = name;
      this.id = ++id;
      store.employers.push(this);
    }

    employees(){
      return store.customers.filter(function(customer){
        return customer.employerId === this.id}.bind(this)
      )
    }

    deliveries(){
      return [].concat.apply([],this.employees().map(function(employee){
        return employee.deliveries();
      }))
    }

    meals(){
      return [].concat.apply([],this.deliveries().map(function(delivery){
        return delivery.meal();
      })).filter(onlyUnique)
    }

    notUniqueMeals(){
      return [].concat.apply([],this.deliveries().map(function(delivery){
        return delivery.meal();
      }))
    }

    mealTotals(){
      const result = {}
      this.notUniqueMeals().forEach(function(meal){
          result[meal.id] = result[meal.id] || 0
          result[meal.id]++
        }
      )
      return result
    }

  }
})()

const Customer = (function () {
  let id = 0;
  return class {
    constructor(name, employer = {}) {
      this.name = name;
      this.employerId = employer.id
      this.id = ++id;
      store.customers.push(this);
    }

    totalSpent(){
      return this.deliveries().reduce(function(acc, el, i, custDeliveries){return acc + el.meal().price}, 0)
    }

    deliveries(){
      return store.deliveries.filter(function(delivery){
        return delivery.customerId === this.id}.bind(this)
      )
    }

    meals(){
      return this.deliveries().map(function(delivery){
        return delivery.meal();
      })
    }

    employer(){
      return store.employers.find(function(employer){return employer.id === this.employerId}.bind(this));
    }

  }
})()
