import { ErrorMessage, Field, Form, Formik } from 'formik';
import type { Note } from '../../types/note';
import css from './NoteForm.module.css'
import * as Yup from "yup";
interface NoteFormProp {
  onSubmit: (value: Pick<Note, "title" | "content" | "tag">) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
    title: Yup.string().min(3, "Min 3 characters").max(50, "Max 50 charecters").required("Required"),
    content: Yup.string().max(500, "Max 500 characters"),
    tag: Yup.string().oneOf(["Todo","Work","Personal","Meeting","Shopping"]).required("Requied"),
    
})

export default function NoteForm({onCancel,onSubmit}:NoteFormProp) {
    return (
     <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
<Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
       
    )
}