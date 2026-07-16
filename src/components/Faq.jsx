import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    id: 'faq-1',
    question: 'How do I report a dangerous waypoint?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    id: 'faq-2',
    question: 'Will my report be acted upon by the authorities?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    id: 'faq-3',
    question: "Is the whistleblower's identity guaranteed to be safe and confidential?",
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    id: 'faq-4',
    question: 'What types of vulnerabilities can be reported through this platform?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
  },
  {
    id: 'faq-5',
    question: 'How can I track the follow-up status of my report?',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
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