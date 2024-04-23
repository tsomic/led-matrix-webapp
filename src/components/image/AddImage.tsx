import { useSignal } from '@preact/signals'
import { Plus } from 'lucide-preact'
import { useState } from 'preact/hooks'
import { postImage } from '../../api/image.post'
import { images as storedImages } from '../../store/store'
import { Dialog } from '../Dialog'
import { ImageCropper } from './ImageCropper'

export function AddImage() {
  const [modalOpen, setModalOpen] = useState(false)
  const imgSrc = useSignal<string>('')
  const fileName = useSignal<string>('')
  const croppedImageFile = useSignal<File | undefined>(undefined)

  const onSelectFile = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = (target.files as FileList)[0]

    fileName.value = file.name

    if (file.type === 'image/gif') {
      uploadFile(file)
      return
    }

    setModalOpen(true)

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      imgSrc.value = reader.result?.toString() || ''
      target.value = ''
    })

    reader.readAsDataURL(file)
  }

  const uploadFile = (file?: File) => {
    if (!file) {
      return
    }

    // TODO rename duplicate files
    const newFileName = fileName.value.replace(/[^a-z0-9.]/gi, '_')
    const renamedFile = new File([file], newFileName, { type: file.type })

    postImage(renamedFile).then(() => {
      // TODO only try to render image when this succeeds
    })

    storedImages.value = [...storedImages.value!, newFileName]

    imgSrc.value = `image/${fileName}`
    setModalOpen(false)
  }

  const onChangeCrop = (file: File) => {
    croppedImageFile.value = file
  }

  const onClickConfirm = () => {
    uploadFile(croppedImageFile.value)
  }

  return (
    <>
      <div className="w-full aspect-square rounded-xl border border-dashed border-muted-foreground text-muted-foreground flex items-center justify-center relative">
        <label htmlFor="file" className="size-full absolute" />
        <input
          type="file"
          accept=".jpg, .jpeg, .png, .gif"
          id="file"
          className="opacity-0 size-0"
          onInput={onSelectFile}
        />
        <Plus />
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <div className="flex flex-col gap-4">
          <ImageCropper src={imgSrc.value} onChangeCrop={onChangeCrop} />
          {/* TODO create new button component */}
          {/* TODO add cancel button */}
          <button
            className="outline-none border rounded-md border-muted-foreground ml-auto px-2"
            onClick={onClickConfirm}
          >
            Confirm
          </button>
        </div>
      </Dialog>
    </>
  )
}
