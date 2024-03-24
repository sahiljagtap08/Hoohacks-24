import { useState, useRef, useEffect, useContext } from 'react';
import Message from './Message';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { MdSend } from 'react-icons/md';
import { replaceProfanities } from 'no-profanity';
import { davinci } from '../utils/davinci';
import { dalle } from '../utils/dalle';
import Modal from './Modal';
import Setting from './Setting';

const options = ['HooGPT', 'HooDALL·E'];
const gptModel = ['gpt-3.5-turbo', 'gpt-4'];
const template = [
  {
    title: 'Information right on the spot',
    prompt: 'Give me a list of top Computer Science schools in the Virginia, and what\'s the In-State Fee?',
  },
  {
    title: 'Optimized Learning',
    prompt: 'Help me study NLP, considering that I have very low attention span and a beginner in the field.',
  },
  {
    title: 'Summarize Topics',
    prompt: 'Summarize NLP in under 100 words, and provide me with a list of resources to learn more about it.',
  },
  {
    title: 'Schedule Optimization',
    prompt: 'Help me prioritize my tasks for the day, considering that I have a lot of work to do and I am feeling overwhelmed.',
  },
];
/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [gpt, setGpt] = useState(gptModel[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
    };

    addMessage(newMsg);
  };

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();

    const key = window.localStorage.getItem('api-key');
    if (!key) {
      setModalOpen(true);
      return;
    }

    const cleanPrompt = replaceProfanities(formValue);

    const newMsg = cleanPrompt;
    const aiModel = selected;
    const gptVersion = gpt;

    setThinking(true);
    setFormValue('');
    updateMessage(newMsg, false, aiModel);
    console.log(gptVersion);

    console.log(selected);
    try {
      if (aiModel === options[0]) {
        const LLMresponse = await davinci(cleanPrompt, key, gptVersion);
        //const data = response.data.choices[0].message.content;
        LLMresponse && updateMessage(LLMresponse, true, aiModel);
      } else {
        const response = await dalle(cleanPrompt, key);
        const data = response.data.data[0].url;
        data && updateMessage(data, true, aiModel);
      }
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
    }

    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // 👇 Get input value
      sendMessage(e);
    }
  };

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <main className='relative flex flex-col h-screen p-1 overflow-hidden dark:bg-light-grey tabs-boxed  bg-gradient-to-r from-blue-500 to-teal-500 text-white p-2 rounded'>
      <div className='justify-center my-10 tabs tabs-boxed bg-gradient-to-r from-blue-500 to-teal-500 text-white p-2 rounded'>
        <a className='backdrop-blur-sm bg-opacity-30 bg-pink-200 rounded-lg shadow-xl p-5'
          href=''>
          <b>WildBerry AI</b>
        </a>
        
      </div>

      <section className='flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32 '>
        {messages.length ? (
          messages.map((message, index) => (
            <Message  key={index} message={{ ...message }} />
          ))
        ) : (
          <div className='flex my-2'>
            <div className='w-screen overflow-hidden'>
              <ul className='grid grid-cols-2 gap-2 mx-10'>
                {template.map((item, index) => (
                  <li
                    onClick={() => setFormValue(item.prompt)}
                    key={index}
                    className=' backdrop-blur-sm bg-opacity-30 bg-pink-200 rounded-lg shadow-xl p-6 border rounded-lg border-slate-300 hover:border-slate-500'>
                    <p className='text-base font-semibold'>{item.title}</p>
                    <p className='text-sm'>{item.prompt}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </section>
      <form
        className='flex flex-col px-10 mb-2 md:px-32 join sm:flex-row'
        onSubmit={sendMessage}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className=' backdrop-blur-sm bg-opacity-30 bg-pink-200 rounded-lg shadow-xl p-5 w-full sm:w-40 select select-bordered join-item'>
          <option>{options[0]}</option>
          <option>{options[1]}</option>
        </select>
        <div className='flex items-stretch justify-between w-full'>
          <textarea
            ref={inputRef}
            className=' backdrop-blur-sm bg-opacity-30 bg-pink-200 rounded-lg shadow-xl p-2 w-full grow input input-bordered join-item max-h-[20rem] min-h-[3rem]'
            value={formValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type='submit' className='join-item btn' disabled={!formValue}>
            <MdSend size={30} />
          </button>
        </div>
      </form>
      <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </main>
  );
};

export default ChatView;
