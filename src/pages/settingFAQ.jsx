import React, { useState } from "react";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const settingFAQ = () => {

    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: "What does lorem means",
            answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
        {
            question: "Where can i subscribe to your newsletter?",
            answer: "You can subscribe to our newsletter by visiting the subscription section available on our website homepage.",
        },
        {
            question: "Whare can i subscribe to your newsletter?",
            answer: "Go to your profile settings and click on change password option to update your password.",
        },
        {
            question: "Whare can i subscribe to your newsletter?",
            answer: "You can contact support through email or the contact us page available in the application.",
        },
    ];

    const toggleFAQ = (index) => {
        if (openIndex === index) {
            setOpenIndex(null);
        } else {
            setOpenIndex(index);
        }
    };

    return (
        <div className="bg-white px-35 max-sm:px-4 py-10 max-sm:py-6">
            <div className="max-w-4xl mx-auto">

                <h1 className="text-[36px] max-sm:text-[24px] font-bold text-[#1A3F1E] mb-8 max-sm:mb-5">
                    FAQ's
                </h1>

                <div className="space-y-5 max-sm:space-y-3">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-100 rounded-xl shadow-md px-6 max-sm:px-4 py-5 max-sm:py-4 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-[16px] max-sm:text-[13px] font-semibold text-[#1A3F1E]">
                                    {faq.question}
                                </h3>
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="text-[#1A3F1E] text-[20px] max-sm:text-[17px] cursor-pointer shrink-0"
                                >
                                    {openIndex === index ? <FaMinusCircle /> : <FaPlusCircle />}
                                </button>
                            </div>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 mt-4 max-sm:mt-3" : "max-h-0"}`}
                            >
                                <p className="text-[14px] max-sm:text-[12px] text-black leading-7 max-sm:leading-6">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default settingFAQ;