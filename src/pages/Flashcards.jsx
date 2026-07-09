import { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaPlus, FaTrash } from 'react-icons/fa';
import { getFlashcards, createFlashcard, deleteFlashcard, updateFlashcard } from "../services/FlashcardServices.js" ;
import './Flashcards.css';

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const res = await getFlashcards();
      setFlashcards(res.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleNext = () => { setIsFlipped(false); setCurrentIndex((prev) => (prev + 1) % flashcards.length); };
  const handlePrev = () => { setIsFlipped(false); setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length); };

  const handleMastered = async () => {
    const card = flashcards[currentIndex];
    try {
      await updateFlashcard(card._id, { ...card, mastered: true });
      setFlashcards(flashcards.map((c, i) => i === currentIndex ? { ...c, mastered: true } : c));
      handleNext();
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const handleAddCard = async () => {
    if (newCard.front && newCard.back) {
      try {
        const res = await createFlashcard(newCard);
        setFlashcards([...flashcards, res.data]);
        setNewCard({ front: '', back: '' });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding flashcard:', error);
      }
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteFlashcard(id);
      setFlashcards(flashcards.filter(card => card._id !== id));
      if (currentIndex >= flashcards.length - 1) setCurrentIndex(0);
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  if (loading) return <div className="loading">Loading flashcards...</div>;

  const progress = flashcards.length ? Math.round((flashcards.filter(c => c.mastered).length / flashcards.length) * 100) : 0;

  return (
    <div className="flashcards-page">
      <h1>📖 Study Flashcards</h1>
      <p className="subtitle">Master your subjects with spaced repetition</p>

      <div className="flashcard-stats">
        <div className="stat"><span className="stat-number">{flashcards.length}</span><span>Total Cards</span></div>
        <div className="stat"><span className="stat-number">{flashcards.filter(c => c.mastered).length}</span><span>Mastered</span></div>
        <div className="stat"><span className="stat-number">{progress}%</span><span>Progress</span></div>
      </div>

      {flashcards.length > 0 ? (
        <>
          <div className="flashcard-container">
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
              <div className="flashcard-front"><p>{flashcards[currentIndex]?.front}</p><small>Click to flip</small></div>
              <div className="flashcard-back"><p>{flashcards[currentIndex]?.back}</p><small>Click to flip back</small></div>
            </div>
            <div className="flashcard-controls">
              <button onClick={handlePrev}><FaArrowLeft /></button>
              <span>{currentIndex + 1} / {flashcards.length}</span>
              <button onClick={handleNext}><FaArrowRight /></button>
              <button onClick={handleMastered} className="mastered-btn">✓ Mastered</button>
            </div>
          </div>
          <div className="progress-bar-container"><div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div></div>
        </>
      ) : (
        <div className="empty-flashcards"><p>No flashcards yet. Create your first one!</p></div>
      )}

      <div className="flashcard-actions"><button className="add-btn" onClick={() => setShowForm(!showForm)}><FaPlus /> Add New Card</button></div>

      {showForm && (
        <div className="flashcard-form">
          <h3>Add New Flashcard</h3>
          <textarea placeholder="Front (Question)" value={newCard.front} onChange={(e) => setNewCard({ ...newCard, front: e.target.value })} rows="3" />
          <textarea placeholder="Back (Answer)" value={newCard.back} onChange={(e) => setNewCard({ ...newCard, back: e.target.value })} rows="3" />
          <div className="form-actions"><button onClick={handleAddCard} className="submit-btn">Add Card</button><button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button></div>
        </div>
      )}

      <div className="flashcard-list">
        <h3>All Flashcards</h3>
        {flashcards.map(card => (
          <div key={card._id} className={`flashcard-item ${card.mastered ? 'mastered' : ''}`}>
            <div className="card-preview"><span className="card-front">{card.front}</span><span className="card-back">{card.back}</span></div>
            <button onClick={() => handleDeleteCard(card._id)} className="delete-btn-small"><FaTrash /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flashcards;