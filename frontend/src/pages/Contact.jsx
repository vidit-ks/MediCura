import { useState } from 'react'
import { BsCheckCircleFill } from 'react-icons/bs'

const Contact = () => {
  const [form, setForm]       = useState({ email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate a short delay (replace with real API call if needed)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section>
        <div className="px-4 mx-auto max-w-screen-md text-center py-16">
          <div className="flex justify-center mb-5">
            <BsCheckCircleFill className="text-[64px] text-green-500" />
          </div>
          <h2 className="heading mb-3">Request Submitted!</h2>
          <p className="text_para font-light mb-6">
            Thank you for reaching out. We've received your message and will get back to you at{' '}
            <span className="font-semibold text-primaryColor">{form.email}</span> shortly.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ email: '', subject: '', message: '' }) }}
            className="btn rounded sm:w-fit"
          >
            Send Another Message
          </button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text_para">
          Got a technical issue? Want to send feedback about a feature? Let us know.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="form_label">Your Email</label>
            <input
              type="email" id="email" required
              placeholder="example@gmail.com"
              className="form_input mt-1"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="subject" className="form_label">Subject</label>
            <input
              type="text" id="subject" required
              placeholder="Let us know how we can help you"
              className="form_input mt-1"
              value={form.subject}
              onChange={handleChange}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="form_label">Your Message</label>
            <textarea
              rows="6" id="message" required
              placeholder="Leave a comment..."
              className="form_input mt-1"
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <button
            className="btn rounded sm:w-fit flex items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                Submitting...
              </>
            ) : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact