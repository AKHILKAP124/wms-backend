import Note from '../models/NoteModel.js';
import User from '../models/UserModel.js';

const createNote = async (req, res) => {
  try {
      const { title, content, owner } = req.body;
      
    // Validate input
    if (!owner) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
      }
      
      const user = await User.findById(owner);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

    const newNote = new Note({
      title,
      content,
      owner
    });

    await newNote.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note: newNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create note',
      error: error.message,
    });
  }
}

const getNotes = async (req, res) => {
  try {
    const { owner } = req.body;

    if (!owner) {
      return res.status(400).json({
        success: false,
        message: 'Owner ID is required',
      });
    }

      const notes = await Note.find({ owner })
      
    if (!notes || notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No notes found',
      });
    }

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: error.message,
    });
  }
}

const updateNote = async (req, res) => {
  try {
    const { id, title, content } = req.body;
    console.log(req.body);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    console.log(id, title, content);
      
      if(title === ""){title = Note.findById(id).then((note) => note.title);}
      if(content === ""){content = Note.findById(id).then((note) => note.content);}
    
    console.log(title, content);
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    console.log(updatedNote);

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update note',
      error: error.message,
    });
  }
}

const deleteNote = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Note ID is required',
      });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: error.message,
    });
  }
}

export { createNote, getNotes, updateNote, deleteNote };