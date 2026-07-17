import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    id: 'faq-1',
    question: 'How do I report a dangerous waypoint?',
    answer: "Log in, open the map, and tap the spot on the map where the danger is. Give it a short title, a description, and mark how serious it is (low, medium, or high risk), then submit. That's it — your report appears on the map for others to see. To keep things fair, you can submit up to 5 reports per day."
  },
  {
    id: 'faq-2',
    question: 'Will my report be acted upon by the authorities?',
    answer: "Each report shows a status — Waiting, In Progress, or Done — so you can see how things are moving. Other residents and, where available, local officials can also leave comments on your report, and reports that get more support from the community tend to stand out more."
  },
  {
    id: 'faq-3',
    question: "Is my identity as a reporter kept confidential?",
    answer: "Yes. Your reports are shown to others as posted by \"Anonymous\" — your name is never displayed alongside your report."
  },
  {
    id: 'faq-4',
    question: 'What types of incidents can be reported through this platform?',
    answer: 'You can report all kinds of everyday issues, such as damaged roads or facilities, broken street lights, garbage or cleanliness problems, safety and crime concerns, and natural disasters like flooding. Anything else that doesn\'t fit these can still be reported under "Other."'
  }
]

function Faq() {
  const [openId, setOpenId] = useState(null)

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
      <section className="flex flex-col items-center py-600 px-300 bg-background" id="faq">
        <div className="section-header max-w-[800px] mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-text2 m-0 mb-4 font-sans tracking-tight text-center">
            Frequently Ask Question
          </h2>
          <p className="text-sm md:text-base text-text3 m-0 leading-normal text-center font-sans">
            Find answers to various questions about <span className="text-main font-semibold">Lapor Aman</span>.
          </p>
        </div>
        <div className="w-full max-w-[1000px] flex flex-col gap-6">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id
            return (
                <div
                    key={faq.id}
                    className="bg-white border border-stroke/60 rounded-[20px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-[box-shadow,border-color] duration-300 hover:shadow-[0_12px_32px_rgba(2,143,101,0.06)] hover:border-stroke"
                >
                  <button
                      className="w-full flex justify-between items-center py-5 px-8 bg-transparent border-none cursor-pointer text-left outline-none transition-colors duration-200"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                  >
                <span className="text-[16px] md:text-[17px] font-bold text-main leading-[1.4] pr-6 font-sans">
                  {faq.question}
                </span>
                    <div
                        className={`bg-main text-text2 rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-transform duration-300 ease-in-out ${
                            isOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    >
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-8 pb-6 pt-2 text-[14px] text-text3 leading-relaxed border-t border-stroke/30 font-sans">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
            )
          })}
        </div>
      </section>
  )
}

export default Faq;