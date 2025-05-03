import React from 'react';
import styles from './ParticipantsModal.module.css';

interface Participant {
  id: number;
  name: string;
}

interface ParticipantsModalProps {
  participants: Participant[];
  onClose: () => void;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ participants, onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Участники мероприятия</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.participantsList}>
          {participants.length === 0 ? (
            <p className={styles.noParticipants}>Пока нет участников</p>
          ) : (
            participants.map(participant => (
              <div key={participant.id} className={styles.participantItem}>
                {participant.name}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal; 