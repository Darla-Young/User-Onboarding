import React, {useState, useEffect} from 'react'
import * as Yup from 'yup'
import axios from 'axios'

const e = {
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
const schema = Yup.object().shape({
  username: Yup
    .string()
    .required(e.usernameRequired)
    .min(3, e.usernameMin)
    .max(20, e.usernameMax),
  favLanguage: Yup
    .string()
    .required(e.favLanguageRequired)
    .oneOf(['javascript', 'rust'], e.favLanguageOptions),
  favFood: Yup
    .string()
    .required(e.favFoodRequired)
    .oneOf(['broccoli', 'spaghetti', 'pizza'], e.favFoodOptions),
  agreement: Yup
    .boolean()
    .required(e.agreementRequired)
    .oneOf([true], e.agreementOptions)
})

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  const initialState = {
    username: '',
    favLanguage: '',
    favFood: '',
    agreement: false
  }
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({...initialState, agreement: ''})
  const [disabled, setDisabled] = useState(true)
  const [response, setResponse] = useState('')

  // ✨ TASK: BUILD YOUR EFFECT HERE
  useEffect(() => {
    schema.isValid(form)
      .then(valid => setDisabled(!valid))
  }, [form])

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    const {checked, type, name, value} = evt.target
    const useThis = type === 'checkbox' ? checked : value
    setForm({...form, [name]: useThis})
    Yup
      .reach(schema, name)
      .validate(useThis)
      .then(() => {
        setErrors({...errors, [name]: ''})
      })
      .catch(err => {
        setErrors({...errors, [name]: err.errors[0]})
      })
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    evt.preventDefault()
    setDisabled(true)
    const newUser = {...form, username: form.username.trim()}
    axios
      .post('https://webapis.bloomtechdev.com/registration', newUser)
      .then(() => {
        setForm(initialState)
        setResponse({
          type: 'success',
          message: `Success! Welcome, ${newUser.username}!`
        })
      })
      .catch(err => {
        setResponse({
          type: 'error',
          message: err.message
        })
      })
  }

  const responseDisplay = () => {
    if(response != '') {
      return (
        <h4 className={response.type}>{response.message}</h4>
      )
    }
  }

  const errorDisplay = input => {
    if(errors[input] != '') {
      return (
        <div className='validation'>{errors[input]}</div>
      )
    }
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      {responseDisplay()}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input onChange={onChange} id="username" name="username" type="text" value={form.username} placeholder="Type Username" />
          {errorDisplay('username')}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input onChange={onChange} type="radio" checked={form.favLanguage === 'javascript'} name="favLanguage" value="javascript" />
              JavaScript
            </label>
            <label>
              <input onChange={onChange} type="radio" checked={form.favLanguage === 'rust'} name="favLanguage" value="rust" />
              Rust
            </label>
          </fieldset>
          {errorDisplay('favLanguage')}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select onChange={onChange} id="favFood" value={form.favFood} name="favFood">
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errorDisplay('favFood')}
        </div>

        <div className="inputGroup">
          <label>
            <input onChange={onChange} id="agreement" checked={form.agreement} type="checkbox" name="agreement" />
            Agree to our terms
          </label>
          {errorDisplay('agreement')}
        </div>

        <div>
          <input onChange={onChange} type="submit" disabled={disabled} />
        </div>
      </form>
    </div>
  )
}
