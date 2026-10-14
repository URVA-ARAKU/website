import React, { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is URVA?',
    answer: 'URVA is a rural-products commerce brand built around One Village – One Product and the regional stories behind Indian goods.'
  },
  {
    question: 'What kinds of products can I discover?',
    answer: 'URVA is organized around regional foods and Araku products, eco-friendly goods, Swadesi handlooms, and Kadiyam nursery plants. Availability depends on the current catalog.'
  },
  {
    question: 'How can I learn where a product comes from?',
    answer: 'Check each product listing for its available origin, maker, ingredient, or material information. We aim to make these details clear and accurate.'
  },
  {
    question: 'Are all products locally sourced or certified?',
    answer: 'Sourcing and certification vary by product. Please refer to the information on each listing and contact support if you need clarification.'
  },
  {
    question: 'Can I place a bulk or business enquiry?',
    answer: 'For questions about a product or a potential business order, please contact URVA support. Availability and terms can be confirmed for each request.'
  },
  {
    question: 'How do I get help with an order?',
    answer: 'Use the order tracking and account pages for order updates, or contact support using the details shown on this website.'
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-[#FAFAFA] border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold text-neutral-400 uppercase tracking-[0.2em] mb-2">
            <FaQuestionCircle className="text-neutral-500" /> Help & Support
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-semibold tracking-tight text-[#111111]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            Questions about regional products, orders, or potential partnerships?
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-neutral-300 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-sans font-semibold text-[#111111] text-sm pr-4">
                    {faq.question}
                  </span>
                  <FaChevronDown
                    className={`text-neutral-400 transition-transform duration-300 shrink-0 text-xs ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-48 border-t border-neutral-100' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-xs text-neutral-600 leading-relaxed font-sans bg-neutral-50/50">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
