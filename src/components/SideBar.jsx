import { useContext, useEffect, useState } from 'react';
import {
  MdClose,
  MdDelete,
  MdMenu,
  MdOutlineVpnKey
} from 'react-icons/md';
import bot from '../assets/logo.svg';
import { ChatContext } from '../context/chatContext';
import Modal from './Modal';
import Setting from './Setting';
import ToggleTheme from './ToggleTheme';

/**
 * A sidebar component that displays a list of nav items and a toggle
 * for switching between light and dark modes.
 *
 * @param {Object} props - The properties for the component.
 */
const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [, , clearChat] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);

  function handleResize() {
    window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
  }

  useEffect(() => {
    handleResize();
  }, []);

  function clear() {
    clearChat();
  }

  return (
    <section
      className={`${
        open ? 'w-72' : 'w-16'
      } bg-white flex flex-col items-center gap-y-4 h-screen pt-4 relative duration-100 shadow-md border-radius-0`}>
      <div className='flex items-center justify-between w-full px-2 mx-auto'>
        <div
          className={` ${
            !open && 'scale-0 hidden'
          } flex flex-row items-center gap-2 mx-auto w-full`}>
          <img src={bot} alt='logo' className='w-6 h-6' />
          <h1 className={` ${!open && 'scale-0 hidden'}`}><b>WildBerry</b></h1>
        </div>
        <div
          className='mx-auto btn btn-square btn-ghost'
          onClick={() => setOpen(!open)}>
          {open ? <MdClose size={15} /> : <MdMenu size={15} />}
        </div>
      </div>

      <ul className='w-full menu rounded-box'>
        <li>
          <a className='border border-slate-500' onClick={clear}>
            <MdDelete size={15} />
            <p className={`${!open && 'hidden'}`}>Clear chat</p>
          </a>
        </li>
      </ul>

      <ul className='absolute bottom-0 w-full gap-1 menu rounded-box'>
        <li>
          <a onClick={() => setModalOpen(true)}>
            <MdOutlineVpnKey size={15} />
            <p className={`${!open && 'hidden'}`}>OpenAI Key</p>
          </a>
        </li>
      </ul>
      <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal>
    </section>
  );
};

export default SideBar;
