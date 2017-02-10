import * as React from 'react'

interface State {
  written: string
  completed: string
}

interface Props extends React.HTMLProps<HTMLInputElement> {
  autocompleteValues: string[]
}

class AutoCompleteInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { 
      written: (props.value && String(props.value)) || '',
      completed: '',
    }

    this.handleOnChange = this.handleOnChange.bind(this)
  }

  fireOnChange(ev: React.FormEvent<HTMLInputElement>, changedValue?: string) {
    if (!this.props.onChange) {
      return
    }

    if (changedValue) {
      ev.currentTarget.value = changedValue
    }

    this.props.onChange(ev)
  }

  handleOnChange(ev: React.FormEvent<HTMLInputElement>) {
    const target = ev.currentTarget
    const value = target.value
    const performMatch = value.length > this.state.written.length

    if (!performMatch) {
      this.fireOnChange(ev)
      this.setState({
        written: value,
        completed: '',
      })
      return
    }

    const match = this.props.autocompleteValues.find(phrase => phrase.indexOf(value) == 0)

    if (match) {
      this.setState({
        written: value,
        completed: match.replace(value, ''),
      }, () => {
        target.focus()
        target.setSelectionRange(value.length, match.length)
      })
    } else {
      this.setState({
        written: value,
        completed: '',
      })
    }

    this.fireOnChange(ev, match)
  }

  render() {
    const { autocompleteValues, ...props } = this.props

    return <input
      ref='input'
      {...props}
      value={`${this.state.written}${this.state.completed}`}
      onChange={this.handleOnChange}
    />
  }
}

export default AutoCompleteInput
