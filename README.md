# Course task generator for rock.so

App to automatically create tasks with section checklist and course description using the Udemy API

## Features 

- Creates rock.so tasks for udemy courses by their link
- Automatic checklist for all the course's sections
- Custom description with user input

## Requirements

- Node.js

## Installation

### Getting rock.so user IDs - https://youtu.be/5BdQ86XhRUA

### 1. Clone the ropository and intall dependencies

```
git clone https://github.com/FernandoROL/auto-course-task-rock.git course-task
cd course-task
npm i
```

### 2. Copy the .env update it with your information from rock

```
cp .env.example .env
```

### And that's it! You're all ready to go!

## How to use

### All you need to do is run the app with the following command + the udemy course link

 **_NOTE:_** Do not add the course coupon code that usually follows the course link

```
npm run app [COURSE URL]
```

**_EXAMPLE_:**  ```npm run app https://www.udemy.com/course/complete-python-bootcamp/```

