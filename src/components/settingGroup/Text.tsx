import { postJson } from '../../api/json.post'
import { data } from '../../store/store'
import { InputSpinner } from '../InputSpinner'
import { InputWrapper } from '../InputWrapper'
import { Switch } from '../Switch'
import { TextInput } from '../TextInput'

type TextSettingsProps = {
  text: string
  vertical: boolean
  textSpeed: number
}

export function Text(initialValues: TextSettingsProps) {
  const updateTextSpeed = (textSpeed: number) => {
    postJson({ textSpeed }).then(() => {
      data.value!.textSpeed = textSpeed
    })
  }

  const updateText = (text: string) => {
    postJson({ text }).then(() => {
      data.value!.text = text
    })
  }

  const updateTextVertical = (vertical: boolean) => {
    postJson({ vertical }).then(() => {
      data.value!.vertical = vertical
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <TextInput initialValue={initialValues.text} onChange={updateText} />
      <InputWrapper title="Vertical text" htmlFor="vertical-switch">
        <Switch
          initialValue={initialValues.vertical}
          id="vertical-switch"
          onChange={updateTextVertical}
        />
      </InputWrapper>
      <InputWrapper title="Text speed">
        <InputSpinner
          numberSteps={8}
          initialValue={initialValues.textSpeed}
          onChange={updateTextSpeed}
        />
      </InputWrapper>
    </div>
  )
}
