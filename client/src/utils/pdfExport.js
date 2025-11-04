import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to expand all collapsible elements in a tree
export const expandAllTreeNodes = (element) => {
  // Find all elements that might be collapsible
  const collapsibleElements = element.querySelectorAll('[data-collapsed], .collapsed, .hidden');
  const expandButtons = element.querySelectorAll('[aria-expanded="false"], button[data-toggle]');
  
  // Expand collapsed elements
  collapsibleElements.forEach(el => {
    el.classList.remove('collapsed', 'hidden');
    el.removeAttribute('data-collapsed');
    if (el.style.display === 'none') {
      el.style.display = '';
    }
  });
  
  // Click expand buttons
  expandButtons.forEach(button => {
    if (button.getAttribute('aria-expanded') === 'false') {
      button.setAttribute('aria-expanded', 'true');
    }
  });
  
  // Show all hidden tree nodes
  const hiddenNodes = element.querySelectorAll('.tree-node[style*="display: none"]');
  hiddenNodes.forEach(node => {
    node.style.display = '';
  });
  
  return true;
};

// Utility function to generate PDF from HTML element
export const exportToPDF = async (elementId, filename, options = {}) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Store original styles
    const originalOverflow = element.style.overflow;
    const originalMaxHeight = element.style.maxHeight;
    const originalHeight = element.style.height;
    
    // Temporarily modify styles to ensure full content is visible
    element.style.overflow = 'visible';
    element.style.maxHeight = 'none';
    element.style.height = 'auto';
    
    // Wait for any dynamic content to render
    await new Promise(resolve => setTimeout(resolve, 200));

    // Get the full dimensions including scrollable content
    const rect = element.getBoundingClientRect();
    const fullWidth = Math.max(element.scrollWidth, element.offsetWidth, rect.width);
    const fullHeight = Math.max(element.scrollHeight, element.offsetHeight, rect.height);

    // Default options with improved settings
    const defaultOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: fullWidth,
      height: fullHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: fullWidth,
      windowHeight: fullHeight,
      ...options
    };

    console.log('Capturing element with dimensions:', { fullWidth, fullHeight });

    // Create canvas from HTML element
    const canvas = await html2canvas(element, defaultOptions);
    
    // Restore original styles
    element.style.overflow = originalOverflow;
    element.style.maxHeight = originalMaxHeight;
    element.style.height = originalHeight;

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Determine PDF orientation based on content dimensions
    const isLandscape = fullWidth > fullHeight;
    const pdfOrientation = isLandscape ? 'l' : 'p';
    
    // PDF dimensions based on orientation
    const pageWidth = isLandscape ? 297 : 210; // A4 dimensions in mm
    const pageHeight = isLandscape ? 210 : 297;
    
    // Calculate image dimensions to fit PDF
    const imgAspectRatio = canvas.width / canvas.height;
    const pageAspectRatio = pageWidth / pageHeight;
    
    let imgWidth, imgHeight;
    
    if (imgAspectRatio > pageAspectRatio) {
      // Image is wider than page ratio
      imgWidth = pageWidth - 20; // 10mm margin on each side
      imgHeight = imgWidth / imgAspectRatio;
    } else {
      // Image is taller than page ratio
      imgHeight = pageHeight - 20; // 10mm margin on top and bottom
      imgWidth = imgHeight * imgAspectRatio;
    }

    // Create PDF
    const pdf = new jsPDF(pdfOrientation, 'mm', 'a4');
    
    // Center the image on the page
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;

    // If image is too tall for one page, split it across multiple pages
    if (imgHeight > pageHeight - 20) {
      const maxHeightPerPage = pageHeight - 20;
      let currentY = 0;
      let pageCount = 0;
      
      while (currentY < imgHeight) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        
        const remainingHeight = imgHeight - currentY;
        const heightForThisPage = Math.min(maxHeightPerPage, remainingHeight);
        
        // Calculate the portion of the original image to use
        const sourceY = (currentY / imgHeight) * canvas.height;
        const sourceHeight = (heightForThisPage / imgHeight) * canvas.height;
        
        // Create a temporary canvas for this page portion
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
        const tempImgData = tempCanvas.toDataURL('image/png', 1.0);
        
        pdf.addImage(tempImgData, 'PNG', xOffset, 10, imgWidth, heightForThisPage);
        
        currentY += maxHeightPerPage;
        pageCount++;
      }
    } else {
      // Single page
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    }

    // Save the PDF
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Specialized function for exporting family trees with better handling of large content
export const exportReactD3TreeToPDF = async (containerId, filename) => {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with ID "${containerId}" not found`);
    }

    const svg = container.querySelector('svg');
    if (!svg) {
      throw new Error('React D3 tree SVG not found');
    }

    const rect = svg.getBoundingClientRect();
    const width = Math.max(rect.width, svg.viewBox?.baseVal?.width || 0) || 1200;
    const height = Math.max(rect.height, svg.viewBox?.baseVal?.height || 0) || 800;

    const clonedSvg = svg.cloneNode(true);
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);
    if (!clonedSvg.getAttribute('viewBox')) {
      clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');

    await new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const isLandscape = width >= height;
    const pageWidth = isLandscape ? 420 : 297;
    const pageHeight = isLandscape ? 297 : 420;
    const pdf = new jsPDF(isLandscape ? 'l' : 'p', 'mm', 'a3');

    const margin = 10;
    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;
    const ratio = Math.min(availableWidth / width, availableHeight / height);
    const imgWidth = width * ratio;
    const imgHeight = height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error exporting React D3 tree PDF:', error);
    throw error;
  }
};

export const exportTreeToPDF = async (elementId, filename, options = {}) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Find all scrollable containers within the element
    const scrollableElements = element.querySelectorAll('[style*="overflow"]');
    const originalStyles = [];

    // Store and modify styles for all scrollable elements
    scrollableElements.forEach((el, index) => {
      originalStyles[index] = {
        element: el,
        overflow: el.style.overflow,
        overflowX: el.style.overflowX,
        overflowY: el.style.overflowY,
        maxHeight: el.style.maxHeight,
        maxWidth: el.style.maxWidth,
        height: el.style.height,
        width: el.style.width
      };
      
      // Make content fully visible
      el.style.overflow = 'visible';
      el.style.overflowX = 'visible';
      el.style.overflowY = 'visible';
      el.style.maxHeight = 'none';
      el.style.maxWidth = 'none';
      el.style.height = 'auto';
      el.style.width = 'auto';
    });

    // Also handle the main element
    const mainOriginalStyles = {
      overflow: element.style.overflow,
      overflowX: element.style.overflowX,
      overflowY: element.style.overflowY,
      maxHeight: element.style.maxHeight,
      maxWidth: element.style.maxWidth,
      height: element.style.height,
      width: element.style.width
    };

    element.style.overflow = 'visible';
    element.style.overflowX = 'visible';
    element.style.overflowY = 'visible';
    element.style.maxHeight = 'none';
    element.style.maxWidth = 'none';
    element.style.height = 'auto';
    element.style.width = 'auto';

    // Expand all tree nodes to ensure full content is visible
    expandAllTreeNodes(element);

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 300));

    // Force a reflow
    void element.offsetHeight;

    // Get full dimensions
    const rect = element.getBoundingClientRect();
    const fullWidth = Math.max(
      element.scrollWidth, 
      element.offsetWidth, 
      element.clientWidth,
      rect.width
    );
    const fullHeight = Math.max(
      element.scrollHeight, 
      element.offsetHeight, 
      element.clientHeight,
      rect.height
    );

    console.log('Tree export dimensions:', { 
      fullWidth, 
      fullHeight, 
      scrollWidth: element.scrollWidth,
      offsetWidth: element.offsetWidth,
      clientWidth: element.clientWidth
    });

    // Enhanced options for tree capture
    const treeOptions = {
      scale: 1.5, // Slightly lower scale for large trees
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: fullWidth,
      height: fullHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: Math.max(window.innerWidth, fullWidth),
      windowHeight: Math.max(window.innerHeight, fullHeight),
      ignoreElements: (element) => {
        // Ignore elements that might cause issues
        return element.classList.contains('tooltip') || 
               element.classList.contains('dropdown') ||
               element.style.position === 'fixed';
      },
      ...options
    };

    // Capture the canvas
    const canvas = await html2canvas(element, treeOptions);

    // Restore all original styles
    originalStyles.forEach((style, index) => {
      const el = style.element;
      el.style.overflow = style.overflow;
      el.style.overflowX = style.overflowX;
      el.style.overflowY = style.overflowY;
      el.style.maxHeight = style.maxHeight;
      el.style.maxWidth = style.maxWidth;
      el.style.height = style.height;
      el.style.width = style.width;
    });

    // Restore main element styles
    element.style.overflow = mainOriginalStyles.overflow;
    element.style.overflowX = mainOriginalStyles.overflowX;
    element.style.overflowY = mainOriginalStyles.overflowY;
    element.style.maxHeight = mainOriginalStyles.maxHeight;
    element.style.maxWidth = mainOriginalStyles.maxWidth;
    element.style.height = mainOriginalStyles.height;
    element.style.width = mainOriginalStyles.width;

    // Convert to PDF
    const imgData = canvas.toDataURL('image/png', 0.95);

    // Determine best orientation and size
    const canvasAspectRatio = canvas.width / canvas.height;
    const isWideTree = canvasAspectRatio > 1.4;
    
    // Use A3 for large trees, A4 for smaller ones
    const useA3 = fullWidth > 1200 || fullHeight > 800;
    const pageFormat = useA3 ? 'a3' : 'a4';
    const orientation = isWideTree ? 'l' : 'p';
    
    // Page dimensions
    const pageDimensions = {
      a4: { width: 210, height: 297 },
      a3: { width: 297, height: 420 }
    };
    
    const pageWidth = orientation === 'l' ? 
      pageDimensions[pageFormat].height : pageDimensions[pageFormat].width;
    const pageHeight = orientation === 'l' ? 
      pageDimensions[pageFormat].width : pageDimensions[pageFormat].height;

    const pdf = new jsPDF(orientation, 'mm', pageFormat);
    
    // Calculate scaling to fit page with margins
    const margin = 10;
    const availableWidth = pageWidth - (2 * margin);
    const availableHeight = pageHeight - (2 * margin);
    
    const scaleX = availableWidth / (canvas.width / 2); // Assuming 2x scale
    const scaleY = availableHeight / (canvas.height / 2);
    const scale = Math.min(scaleX, scaleY);
    
    const imgWidth = (canvas.width / 2) * scale;
    const imgHeight = (canvas.height / 2) * scale;
    
    // Center the image
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    // Handle multi-page if needed
    if (imgHeight > availableHeight) {
      // Split across multiple pages
      const pagesNeeded = Math.ceil(imgHeight / availableHeight);
      const heightPerPage = availableHeight;
      
      for (let page = 0; page < pagesNeeded; page++) {
        if (page > 0) pdf.addPage();
        
        const sourceY = (page * heightPerPage / imgHeight) * canvas.height;
        const sourceHeight = Math.min(
          (heightPerPage / imgHeight) * canvas.height,
          canvas.height - sourceY
        );
        
        // Create temporary canvas for this page
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sourceHeight;
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
        const tempImgData = tempCanvas.toDataURL('image/png', 0.95);
        
        const pageImgHeight = (sourceHeight / canvas.height) * imgHeight;
        pdf.addImage(tempImgData, 'PNG', x, margin, imgWidth, pageImgHeight);
      }
    } else {
      // Single page
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    }

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating tree PDF:', error);
    throw error;
  }
};

// Generate family tree data as text for PDF
export const generateFamilyTreeText = (data, level = 0) => {
  if (!data) return '';
  
  const indent = '  '.repeat(level);
  let text = `${indent}${data.name}`;
  
  if (data.attributes) {
    if (data.attributes.serNo) text += ` (#${data.attributes.serNo})`;
    if (data.attributes.gender) text += ` - ${data.attributes.gender}`;
    if (data.attributes.spouse) text += ` (Spouse: ${data.attributes.spouse})`;
    if (data.attributes.vansh) text += ` [${data.attributes.vansh}]`;
  }
  
  text += '\n';
  
  if (data.children && data.children.length > 0) {
    data.children.forEach(child => {
      text += generateFamilyTreeText(child, level + 1);
    });
  }
  
  return text;
};

// Generate detailed family tree report as text
export const generateDetailedFamilyReport = (data, rootName = '') => {
  const generateDate = new Date().toLocaleDateString();
  const generateTime = new Date().toLocaleTimeString();
  
  let report = `BAL KRISHNA NIVAS - FAMILY TREE REPORT\n`;
  report += `${'='.repeat(60)}\n\n`;
  report += `Generated on: ${generateDate} at ${generateTime}\n`;
  report += `Root Member: ${rootName}\n`;
  report += `Report Type: Complete Family Tree Structure\n`;
  report += `${'='.repeat(60)}\n\n`;
  
  // Count total members and gather statistics
  const countMembers = (node) => {
    let count = 1;
    if (node.children) {
      node.children.forEach(child => {
        count += countMembers(child);
      });
    }
    return count;
  };
  
  const gatherStatistics = (node, stats = { male: 0, female: 0, unknown: 0, generations: 0 }, level = 0) => {
    stats.generations = Math.max(stats.generations, level + 1);
    
    if (node.attributes && node.attributes.gender) {
      if (node.attributes.gender.toLowerCase() === 'male') stats.male++;
      else if (node.attributes.gender.toLowerCase() === 'female') stats.female++;
      else stats.unknown++;
    } else {
      stats.unknown++;
    }
    
    if (node.children) {
      node.children.forEach(child => {
        gatherStatistics(child, stats, level + 1);
      });
    }
    
    return stats;
  };
  
  const totalMembers = countMembers(data);
  const statistics = gatherStatistics(data);
  
  report += `FAMILY STATISTICS:\n`;
  report += `${'-'.repeat(20)}\n`;
  report += `Total Family Members: ${totalMembers}\n`;
  report += `Male Members: ${statistics.male}\n`;
  report += `Female Members: ${statistics.female}\n`;
  report += `Unknown Gender: ${statistics.unknown}\n`;
  report += `Total Generations: ${statistics.generations}\n\n`;
  
  report += `FAMILY TREE STRUCTURE:\n`;
  report += `${'-'.repeat(25)}\n`;
  report += `(Format: Name (#SerialNo) - Gender [Vansh] (Spouse: Name))\n\n`;
  report += generateFamilyTreeText(data);
  
  report += `\n${'='.repeat(60)}\n`;
  report += `End of Report - Bal Krishna Nivas Family Tree\n`;
  report += `Generated by Family Tree Management System\n`;
  report += `${'='.repeat(60)}`;
  
  return report;
};

// Export text-based family tree as PDF
export const exportTextTreeToPDF = (data, filename, rootName = '') => {
  try {
    const pdf = new jsPDF();
    const report = generateDetailedFamilyReport(data, rootName);
    
    // Split text into lines and add to PDF
    const lines = pdf.splitTextToSize(report, 180);
    let y = 20;
    const lineHeight = 7;
    const pageHeight = 280;
    
    lines.forEach((line, index) => {
      if (y > pageHeight) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 15, y);
      y += lineHeight;
    });
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating text PDF:', error);
    throw error;
  }
};

// Export family member details as PDF
export const exportMemberDetailsToPDF = (member, filename) => {
  try {
    const pdf = new jsPDF();
    const generateDate = new Date().toLocaleDateString();
    const generateTime = new Date().toLocaleTimeString();
    
    // Header
    pdf.setFontSize(18);
    pdf.text('BAL KRISHNA NIVAS', 15, 20);
    pdf.setFontSize(14);
    pdf.text('FAMILY MEMBER PROFILE', 15, 30);
    
    // Line separator
    pdf.setLineWidth(0.5);
    pdf.line(15, 35, 195, 35);
    
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${generateDate} at ${generateTime}`, 15, 45);
    
    // Member details
    let y = 60;
    const lineHeight = 8;
    const sectionSpacing = 12;
    
    // Name (prominent)
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text(`${member.name}`, 15, y);
    y += lineHeight + 5;
    
    // Basic Information Section
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('BASIC INFORMATION', 15, y);
    y += lineHeight;
    
    pdf.setLineWidth(0.3);
    pdf.line(15, y, 100, y);
    y += 5;
    
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    
    if (member.serNo) {
      pdf.text(`Serial Number: ${member.serNo}`, 15, y);
      y += lineHeight;
    }
    
    if (member.gender) {
      pdf.text(`Gender: ${member.gender}`, 15, y);
      y += lineHeight;
    }
    
    if (member.vansh) {
      pdf.text(`Vansh (Lineage): ${member.vansh}`, 15, y);
      y += lineHeight;
    }
    
    if (member.dateOfBirth) {
      pdf.text(`Date of Birth: ${new Date(member.dateOfBirth).toLocaleDateString()}`, 15, y);
      y += lineHeight;
    }
    
    if (member.occupation) {
      pdf.text(`Occupation: ${member.occupation}`, 15, y);
      y += lineHeight;
    }
    
    // Family Information Section
    if (member.spouse && member.spouse.name) {
      y += sectionSpacing;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('FAMILY INFORMATION', 15, y);
      y += lineHeight;
      
      pdf.setLineWidth(0.3);
      pdf.line(15, y, 100, y);
      y += 5;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Spouse: ${member.spouse.name}`, 15, y);
      y += lineHeight;
    }
    
    // Biography Section
    if (member.biography) {
      y += sectionSpacing;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('BIOGRAPHY', 15, y);
      y += lineHeight;
      
      pdf.setLineWidth(0.3);
      pdf.line(15, y, 100, y);
      y += 5;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      const bioLines = pdf.splitTextToSize(member.biography, 180);
      bioLines.forEach(line => {
        if (y > 270) { // Check if we need a new page
          pdf.addPage();
          y = 20;
        }
        pdf.text(line, 15, y);
        y += lineHeight;
      });
    }
    
    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Page ${i} of ${pageCount}`, 15, 285);
      pdf.text('Bal Krishna Nivas Family Tree System', 120, 285);
    }
    
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating member details PDF:', error);
    throw error;
  }
};