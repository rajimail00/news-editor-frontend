import React, { useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import axios from 'axios';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const NewsEditor = () => {
  const editorInstance = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const initializeEditor = async () => {
    editorInstance.current = new EditorJS({
      holderId: 'editorjs',
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        // Add more tools as needed
      },
      data: {},
    });

    try {
      await editorInstance.current.isReady;
      setIsEditorReady(true);
      console.log('Editor.js is ready to work!');
      // Do anything you need after editor initialization
    } catch (reason) {
      console.log(`Editor.js initialization failed because of ${reason}`);
    }
  };

  const saveNews = async () => {
    if (isEditorReady) {
      try {
        const savedData = await editorInstance.current.save();
        const titleBlock = savedData.blocks.find((block) => block.type === 'header');
        const title = titleBlock ? titleBlock.data.text : 'Untitled';

        await axios.post('http://localhost:5000/api/news', { title, content: savedData });
        alert('News saved successfully!');
      } catch (error) {
        console.error('Error saving news:', error);
        alert('Error saving news. Please try again.');
      }
    } else {
      alert('Editor is not ready. Please wait for initialization.');
    }
  };

  return (
    <Container >
      <Box mt={2} display="flex" justifyContent="flex-start">
        <Button variant="contained" color="primary" onClick={initializeEditor} disabled={isEditorReady}>
          Initialize Editor
        </Button>
        {/* <Button variant="contained" color="secondary" onClick={saveNews} disabled={!isEditorReady}>
          Save News
        </Button> */}
      </Box>
      <Box mt={2}>
        <div id="editorjs"></div>
      </Box>
    </Container>
  );
};

export default NewsEditor;
