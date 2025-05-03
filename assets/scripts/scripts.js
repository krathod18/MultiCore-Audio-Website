// Typewriter created by Tameem Safi.
// source: https://github.com/tameemsafi/typewriterjs

var app = document.getElementById('app');

var typewriter = new Typewriter(app, {
    loop: true,
    delay:50,
    deleteSpeed:5
});

typewriter.typeString("hey there!")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("i'm kavya.")
    .pauseFor(1000)
    .deleteAll()
    .pauseFor(500)
    .typeString("this is TAOS — my multicore OS project.")
    .pauseFor(1500)
    .deleteAll()
    .pauseFor(500)
    .typeString("this site is all about intel hda audio.")
    .pauseFor(1500)
    .deleteAll()
    .pauseFor(500)
    .typeString("scroll down to see what i've built.")
    .pauseFor(1500)
    .deleteAll()
    .start();

// When the user scrolls down 20px from the top of the document, slide down the navbar
window.onscroll = function() {scrollFunction()};

function toggleSection(id, show) {
  const el = document.getElementById(id);
  if (el) {
    if (show) {
      el.classList.remove("hidden");
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      el.classList.add("hidden");
      const projects = document.getElementById("project-section");
      if (projects) projects.scrollIntoView({ behavior: "smooth" });
    }
  }
}
const projectData = {
  init: {
    title: "HDA Driver Initialization",
    content: `
      <p>Describes how the Intel HDA controller is discovered and prepared for use.</p>
      <ul>
        <li><b>PCI Device Discovery:</b> Search the PCI bus for a device with the HDA-specific class code and retrieve its memory-mapped I/O base address.</li>
        <li><b>Memory Mapping:</b> Translate the physical BAR address into a usable virtual address using the kernel's high-half mapping offset.</li>
        <li><b>Register Access:</b> Access controller and stream registers by casting the mapped base to the appropriate register structure.</li>
        <li><b>Controller Reset:</b> Toggle the controller reset bit and wait for confirmation; delay to allow codecs to power up and become ready.</li>
        <li><b>Command Buffer Setup:</b>
          <ul>
            <li>Disable the command engine, determine supported buffer size, and allocate aligned memory for the ring buffer.</li>
            <li>Program the base address registers, reset the read and write pointers, and re-enable the engine.</li>
          </ul>
        </li>
        <li><b>Response Buffer Setup:</b>
          <ul>
            <li>Disable the response engine, determine supported size, and allocate aligned memory.</li>
            <li>Write buffer base to hardware registers, reset the write pointer, and enable the engine with interrupts configured.</li>
          </ul>
        </li>
        <li><b>Interrupt Enable:</b> Configure global and stream-specific interrupt bits in the controller’s interrupt control register.</li>
        <li><b>Playback Verification:</b> Run an integrated routine that sends commands, configures the audio path, and attempts real audio playback.</li>
      </ul>
    `
  },
  codec: {
    title: "Codec and Widget Discovery",
    content: `
      <p>Details the discovery process for codec function groups and internal audio widgets.</p>
      <ul>
        <li><b>AFG Identification:</b> Query potential codec nodes to determine which is the Audio Function Group.</li>
        <li><b>Widget Enumeration:</b> After locating the AFG, determine how many widget nodes exist and where they start.</li>
        <li><b>Capability Queries:</b> For each widget, retrieve information such as type, amplifier properties, pin capabilities, and connection topology.</li>
        <li><b>Connection Graph Construction:</b> Fetch connection list length and individual connection targets to build a directed graph of audio routes.</li>
        <li><b>Playback Path Tracing:</b> Perform a depth-first traversal from a pin widget to locate a valid DAC output, verifying usable playback routing.</li>
      </ul>
    `
  },
  corb: {
    title: "Command and Response Handling",
    content: `
      <p>Explains how communication with the codec is managed using DMA-based ring buffers.</p>
      <ul>
        <li><b>Command Construction:</b> Encode codec address, node ID, verb, and payload into a single command word.</li>
        <li><b>Submission Logic:</b> Check that the command ring buffer is not full before inserting a new command and updating the write pointer.</li>
        <li><b>Response Retrieval:</b> Wait for the response engine to receive a result, using either polling or timeouts, then read it from the ring buffer.</li>
        <li><b>Feedback Loop:</b> Validate that the command was processed correctly by interpreting the response contents.</li>
      </ul>
    `
  },
  stream: {
    title: "Audio Stream Configuration",
    content: `
      <p>Describes how playback streams are configured and started via hardware stream registers.</p>
      <ul>
        <li><b>Reset Sequence:</b> Stop the stream, toggle the reset bit, and wait for hardware confirmation.</li>
        <li><b>Status Clear:</b> Clear relevant interrupt or error flags to avoid false triggers during reconfiguration.</li>
        <li><b>BDL Programming:</b> Write the address of the buffer descriptor list to hardware, ensuring proper alignment and content validity.</li>
        <li><b>Stream Parameter Setup:</b> Configure buffer size, list index, stream ID, and audio format (based on WAV metadata).</li>
        <li><b>Activation:</b> Enable the stream by writing to the control register with run and interrupt flags enabled.</li>
      </ul>
    `
  },
  wav: {
    title: "WAV File Parsing",
    content: `
      <p>Outlines how audio data is extracted from a WAV file stored in the filesystem.</p>
      <ul>
        <li><b>File Access:</b> Open a WAV file using the custom filesystem's node interface.</li>
        <li><b>Header Decoding:</b> Read the format chunk to get audio parameters like sample rate, bit depth, and number of channels.</li>
        <li><b>Memory Copy:</b> Copy raw audio bytes into a pre-allocated buffer designed for DMA playback.</li>
        <li><b>Cache Flush:</b> Ensure memory coherence by explicitly flushing the CPU cache to main memory before hardware access.</li>
      </ul>
    `
  },
  dma: {
    title: "DMA-Based Audio Playback",
    content: `
      <p>Explains how audio data is streamed to the codec using DMA engines and descriptor lists.</p>
      <ul>
        <li><b>Memory Allocation:</b> Allocate audio buffer and multiple BDLs with proper physical alignment.</li>
        <li><b>BDL Setup:</b> Divide the audio buffer into multiple entries in each descriptor list; initialize two lists to support BDL switching mid-playback.</li>
        <li><b>Playback Control:</b> Start the stream and monitor playback progress via position buffer and status flags.</li>
        <li><b>BDL Swapping:</b> Detect completion of first BDL using interrupt status; then stop the stream, update buffer pointers and size fields, and restart playback with the second BDL.</li>
      </ul>
    `
  },
  interrupt: {
    title: "Interrupt Handling",
    content: `
      <p>Describes how hardware interrupts are used to handle audio events and responses.</p>
      <ul>
        <li><b>Status Checking:</b> When triggered, read both general and response-specific interrupt registers.</li>
        <li><b>Flag Clearing:</b> Write back read values to clear the interrupt sources.</li>
        <li><b>System Notification:</b> Send a completion signal to the processor’s interrupt controller.</li>
        <li><b>Polling Backup:</b> Fallback polling logic is included for use in environments where interrupts are unreliable or unimplemented.</li>
      </ul>
    `
  },
  integration: {
    title: "System Integration & Testing",
    content: `
      <p>Details how the audio driver was tested and verified inside the operating system kernel.</p>
      <ul>
        <li><b>Driver Embedding:</b> Integrate driver initialization into kernel startup, ensuring that audio setup occurs automatically at boot.</li>
        <li><b>End-to-End Testing:</b> Run an audio test that loads a WAV file, discovers the playback path, sets up buffers, and begins playback.</li>
        <li><b>Output Monitoring:</b> Use debug logs to confirm progress through command handling, stream activation, and buffer playback.</li>
      </ul>
      <p>This test validates the full audio path, from file system access through hardware DMA to audio codec output.</p>
    `
  }
};



function openOverlay(key) {
  const overlay = document.getElementById('project-overlay');
  const inner = document.getElementById('overlay-inner');
  const data = projectData[key];
  if (overlay && inner && data) {
    inner.innerHTML = `<h1>${data.title}</h1>${data.content}`;
    overlay.classList.remove('hidden');
  }
}

function closeOverlay() {
  const overlay = document.getElementById('project-overlay');
  if (overlay) overlay.classList.add('hidden');
}


function toggleDetail(link) {
  const detail = link.parentElement.querySelector('.hda-detail');
  if (detail) {
    detail.classList.toggle('hidden');
  }
}

function scrollFunction() {
  if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
    document.getElementById("nav").style.top = "0";
  } else {
    document.getElementById("nav").style.top = "-70px";
  }
}


// $(function() {
//   $('a[href*=#]').on('click', function(e) {
//     e.preventDefault();
//     $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
//   });
// });

//filter buttons 
//source : https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_filter_elements

filterSelection("all")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("each-project");
  if (c == "all") c = "";
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    console.log(element.className, arr2[i]);
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("button-section");
var btns = btnContainer.getElementsByClassName("filter-button");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
    console.log(current);
  });
}