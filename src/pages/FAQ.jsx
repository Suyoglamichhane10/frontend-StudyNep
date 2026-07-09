import './FAQ.css';

const faqs = [
  {
    question: 'How do I sign up for StudyNep?',
    answer: 'Click on Sign Up in the top navigation, fill in your details, and start using the platform right away.'
  },
  {
    question: 'Can teachers share study materials?',
    answer: 'Yes, teachers can upload materials, assign quizzes, and send feedback to their students.'
  },
  {
    question: 'Where can students view their feedback?',
    answer: 'Students can view teacher feedback directly on their Dashboard under the Teacher Feedback card.'
  },
  {
    question: 'Is there a personalized study planner?',
    answer: 'Yes, the Planner and Schedule pages help students plan weekly study sessions and manage deadlines.'
  },
  {
    question: 'How do I access my profile?',
    answer: 'Once logged in, click Profile in the navbar to manage your account and settings.'
  }
];

function FAQ() {
  return (
    <div className="faq-page">
      <div className="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Answers to the most common questions from students, teachers, and parents using StudyNep.</p>
      </div>

      <div className="faq-list">
        {faqs.map((item, index) => (
          <div key={index} className="faq-item">
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
