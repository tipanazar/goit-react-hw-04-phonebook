import { useState, useEffect, useRef, useCallback } from 'react';
import { nanoid } from 'nanoid';

import ContactForm from './contactForm/ContactForm';
import Filter from './filter/Filter';
import ContactList from './contactList/ContactList';

import styles from './app.module.css';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const firstRender = useRef(true);

  useEffect(() => {
    const localContacts = JSON.parse(localStorage.getItem('contacts'));
    if (firstRender.current && localContacts.length) {
      setContacts(localContacts);
    }
    if (!firstRender.current && localContacts.length !== contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    firstRender.current = false;
  }, [contacts]);

  const filteringContacts = useCallback(ev => {
    setFilter(ev.target.value);
  }, []);

  const addContactBtn = useCallback(
    contactData => {
      const { name, number } = contactData;
      const clone = contacts.find(
        clone => clone.name === name || clone.number === number
      );

      if (clone) {
        return alert(`${name} is already in your contacts`);
      }
      setContacts(prevState => {
        return [...prevState, { id: nanoid(), name: name, number: number }];
      });
    },
    [contacts]
  );
  const deleteContactBtn = id => {
    setContacts(prevState => {
      return [...prevState.filter(contact => contact.id !== id)];
    });
  };

  const filteredContacts = () => {
    const filteredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter)
    );
    return filteredContacts;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contactContainer}>
        <ContactForm onSubmit={addContactBtn} />
      </div>

      <div className={styles.listContainer}>
        <h2>Contacts</h2>
        <Filter filteringContacts={filteringContacts} filter={filter} />
        <ContactList
          deleteContactBtn={deleteContactBtn}
          filteredContacts={filteredContacts()}
        />
      </div>
    </div>
  );
};

// export App;
