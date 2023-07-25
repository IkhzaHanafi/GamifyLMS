import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Typography, AppBar, Toolbar, IconButton, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

const StyledAppBar = styled(AppBar)`
  background-color: #3f51b5; /* Customize the background color */
`;

const StyledPaper = styled(Paper)`
  margin: 16px;
  padding: 16px;
`;

const StyledContent = styled.div`
  margin-top: 16px;
`;

const DetailMaterial = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { id } = useParams();
  const [material, setMaterial] = useState(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const materialDocRef = doc(firestore, 'classes', classId, 'moduls', id);
        const materialDocSnap = await getDoc(materialDocRef);

        if (materialDocSnap.exists()) {
          setMaterial({ id: materialDocSnap.id, ...materialDocSnap.data() });
        } else {
          console.log('Modul not found!');
        }
      } catch (error) {
        console.error('Error fetching modul:', error);
      }
    };

    fetchMaterial();
  }, [id]);

  if (!material) {
    // Loading state, you can add a spinner or any other loading indicator here
    return <div>Loading...</div>;
  }

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Detail Material</Typography>
        </Toolbar>
      </StyledAppBar>

      <StyledPaper elevation={2}>
        <Typography variant="h5" gutterBottom>
          {material.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {material.date}
        </Typography>
        <Divider />
        <StyledContent>
          <Typography variant="body1" gutterBottom>
            {material.description}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Attachments
          </Typography>
          {material.attachments.map((attachment) => (
            <div key={attachment.id}>
              <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                {attachment.name}
              </a>
              <br />
            </div>
          ))}
        </StyledContent>
      </StyledPaper>
    </>
  );
};

export default DetailMaterial;





// import React from 'react';
// import styled from 'styled-components';
// import { useNavigate } from "react-router-dom";
// import { Paper, Typography, AppBar, Toolbar, IconButton, Divider } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const StyledAppBar = styled(AppBar)`
//   background-color: #3f51b5; /* Customize the background color */
// `;

// const StyledPaper = styled(Paper)`
//   margin: 16px;
//   padding: 16px;
// `;

// const StyledContent = styled.div`
//   margin-top: 16px;
// `;

// const DetailMaterial = () => {
//   const navigate = useNavigate();

//   // Replace these with your actual material data
//   const material = {
//     title: 'Pengantar UI/UX Design',
//     description: 'Materi ini merupakan pengantar tentang UI/UX design dalam pengembangan produk digital.',
//     date: '24 Juli, 2023',
//     attachments: [
//       { id: 1, name: 'Slide Materi', url: 'https://www.slideshare.net/zamdesign1/pengantar-uiux' },
//       { id: 2, name: 'Modul ODF', url: 'https://eprints.upnyk.ac.id/26163/1/Buku_InterfaceUSERExperience_MangarasYanuF.pdf' },
//     ],
//   };
  

//   return (
//     <>
//       <StyledAppBar position="static">
//         <Toolbar>
//           <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="back">
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6">Detail Material</Typography>
//         </Toolbar>
//       </StyledAppBar>

//       <StyledPaper elevation={2}>
//         <Typography variant="h5" gutterBottom>
//           {material.title}
//         </Typography>
//         <Typography variant="subtitle1" color="textSecondary" gutterBottom>
//           {material.date}
//         </Typography>
//         <Divider />
//         <StyledContent>
//           <Typography variant="body1" gutterBottom>
//             {material.description}
//           </Typography>
//           <Typography variant="h6" gutterBottom>
//             Attachments
//           </Typography>
//           {material.attachments.map((attachment) => (
//             <div key={attachment.id}>
//               <a href={attachment.url} target="_blank" rel="noopener noreferrer">
//                 {attachment.name}
//               </a>
//               <br />
//             </div>
//           ))}
//         </StyledContent>
//       </StyledPaper>
//     </>
//   );
// };

// export default DetailMaterial;
