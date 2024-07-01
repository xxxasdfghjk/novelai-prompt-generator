'use client'
import { Chip } from '@mui/material'
import React, { useState, useRef, forwardRef, useContext } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
interface Item {
  id: number
  text: string
}
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Autocomplete from '@mui/material/Autocomplete'
import danbooruTag from '../../public/danbooru.json'
interface DraggableItemProps {
  item: Item
  moveItem: (oldIndex: number, newIndex: number) => void
  onDoubleClick: (item: Item) => void
  onDelete: () => void
}

const DraggableItem = ({
  item,
  onDoubleClick,
  onDelete
}: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: item.id
  })

  return (
    <Chip
      component="li"
      ref={setNodeRef}
      label={item.text}
      onDelete={onDelete}
      className={`cursor-pointer text-slate-100 bg-green-900 m-1 transition duration-100 w-30`}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Translate.toString(transform)
      }}
      onDoubleClick={() => onDoubleClick(item)}
      variant="outlined"
      inputMode="text"
      onPointerDown={(e) => e.stopPropagation()}
    />
  )
}

interface SortableListProps {
  items: Item[]
}

const SortableList = ({ items }: SortableListProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const [list, setList] = useState<Item[]>(items)
  const [open, setOpen] = useState<boolean>(false)
  const [item, setItem] = useState<Item | undefined>()
  const [newText, setNewText] = useState<string>('')

  const handleClose = () => {
    setOpen(false)
  }
  const handleSubmit = () => {
    if (newText !== '') {
      setList((prev) => {
        prev.find((e) => e.id === item?.id)!.text = newText
        return [...prev]
      })
    } else {
      onDelete(list.findIndex((e) => e.id === item!.id))()
    }
    setOpen(false)
  }
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(MouseSensor, {
      activationConstraint: { distance: 20, delay: 100, tolerance: 5 }
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setList((items) => {
        const oldIndex = list.findIndex((item) => item.id === active.id)
        const newIndex = list.findIndex((item) => item.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
  const moveItem = (oldIndex: number, newIndex: number) => {
    setList((items) => arrayMove(items, oldIndex, newIndex))
  }

  const onDoubleClick = (item: Item) => {
    setOpen(true)
    setItem(item)
    setNewText(item.text)
    setTimeout(() => ref.current?.focus(), 100)
  }

  const onDelete = (index: number) => () => {
    setList((prev) => {
      prev.splice(index, 1)
      return [...prev]
    })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={list} strategy={rectSortingStrategy}>
        <ul className="flex flex-row flex-wrap p-2">
          {list.map((item, index) => (
            <DraggableItem
              key={item.id}
              item={item}
              moveItem={moveItem}
              onDoubleClick={onDoubleClick}
              onDelete={onDelete(index)}
            />
          ))}
        </ul>
      </SortableContext>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        hideBackdrop
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <TextField
                inputRef={ref}
                autoFocus
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </DndContext>
  )
}

const items: Item[] = [
  {
    id: 100,
    text: '1girl'
  },
  {
    id: 1,
    text: '1boy'
  },
  {
    id: 2,
    text: 'moe (swimsuit) (blue archive)'
  },
  {
    id: 3,
    text: 'blue archive'
  },
  {
    id: 4,
    text: 'atdan'
  },
  {
    id: 5,
    text: 'ciloranko'
  },
  {
    id: 6,
    text: '[[[ai generated]]]'
  },
  {
    id: 7,
    text: 'modare'
  },
  {
    id: 8,
    text: '[[[wlop]]]'
  },
  {
    id: 14,
    text: 'looking up'
  },
  {
    id: 15,
    text: 'dutch angle'
  },
  {
    id: 16,
    text: 'half eye closed'
  },
  {
    id: 17,
    text: 'full nude'
  },
  {
    id: 18,
    text: 'adult'
  },
  {
    id: 19,
    text: '{orgasm}'
  },
  {
    id: 20,
    text: 'POV'
  },
  {
    id: 21,
    text: 'oral'
  },
  {
    id: 22,
    text: 'from above'
  },
  {
    id: 23,
    text: 'all fours'
  },
  {
    id: 24,
    text: 'ass'
  }
]

import { autocompleteClasses } from '@mui/material/Autocomplete'
import useMediaQuery from '@mui/material/useMediaQuery'
import ListSubheader from '@mui/material/ListSubheader'
import Popper from '@mui/material/Popper'
import { useTheme, styled } from '@mui/material/styles'
import { VariableSizeList, ListChildComponentProps } from 'react-window'
import Typography from '@mui/material/Typography'

const LISTBOX_PADDING = 8 // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props
  const dataSet = data[index]
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING
  }

  if (dataSet.hasOwnProperty('group')) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    )
  }

  const { key, ...optionProps } = dataSet[0]

  return (
    <Typography
      key={key}
      component="li"
      {...optionProps}
      noWrap
      style={inlineStyle}
    >
      {`${dataSet[1]}`}
    </Typography>
  )
}

const OuterElementContext = React.createContext({})

// eslint-disable-next-line react/display-name
const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})

function useResetCache(data: number) {
  const ref = React.useRef<VariableSizeList>(null)
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props
  const itemData: React.ReactElement[] = []
  ;(children as React.ReactElement[]).forEach(
    (item: React.ReactElement & { children?: React.ReactElement[] }) => {
      itemData.push(item)
      itemData.push(...(item.children || []))
    }
  )

  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
    noSsr: true
  })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = (child: React.ReactElement) => {
    if (child.hasOwnProperty('group')) {
      return 48
    }

    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0
    }
  }
})

const TextEditor: React.FC = () => {
  return (
    <DndContext>
      <SortableList items={items} />
      <Autocomplete
        id="grouped-demo"
        options={danbooruTag}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            className={'rounded-md m-2 text-slate-100 bg-slate-700'}
          />
        )}
        disableListWrap
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        renderOption={(props, option, state) =>
          [props, option, state.index] as React.ReactNode
        }
      />
    </DndContext>
  )
}

export default TextEditor
