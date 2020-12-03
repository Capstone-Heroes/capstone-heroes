import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { getTestResults, addTestResults } from '../../redux/testResults'
import { ResultsCard } from '../FriendProfile/StyleElements'
import { TestCard, FormQuestion, Submit, OuterWrapper  } from './StyleElements'
import { RowContainer, ColumnContainer } from '../styledComponents'

function TestResultForm({setShowForm}) {
  const dispatch = useDispatch()
  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data, ev) => {
    dispatch(addTestResults(data))
    ev.target.reset()
    setShowForm(false)
  }

  return (
    <TestCard>
      <form onSubmit={ handleSubmit(onSubmit) }>
        <ColumnContainer>
          <div>
            <FormQuestion className="question">Test Result:</FormQuestion>
            <OuterWrapper>
              <RowContainer>
                <input name="result" type="radio" id="result-pos" value="Positive" required ref={ register } />
                <label htmlFor="result-pos">Positive</label>
              </RowContainer>
              <RowContainer>
                <input name="result" type="radio" id="result-neg" value="Negative" ref={ register } />
                <label htmlFor="result-neg">Negative</label>
              </RowContainer>
              {errors.result && 'Please indicate a test result'}
            </OuterWrapper>
          </div>
          <div>
            <FormQuestion className="question">Test Date:</FormQuestion>
            <input name="date" id="date" ref={register} required />
            {errors.result && 'Please enter a date'}
          </div>
          <Submit type="submit" id="submit-result" value="Submit" />
        </ColumnContainer>
      </form>
    </TestCard>
  )
}

function TestResults() {
  const [loaded, setLoaded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const testResults = useSelector(state => state.testResults)


  useEffect(() => {
    if (!loaded) {
      dispatch(getTestResults())
      setLoaded(true)
    }
  }, [testResults.length])

  return (
    <ResultsCard>
      <h2>Test Results <span className="plus-button" onClick={() => { setShowForm(!showForm) }}>+</span></h2>
      {showForm && <TestResultForm setShowForm={setShowForm}/>}
      <ul className="no-bullet">
        {testResults.map((test, id) => {
          return (
            <li key={id}>{test.result}: {test.date}</li>
          )
        })}
      </ul>
    </ResultsCard>
  )
}

export default TestResults