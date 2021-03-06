const fileUploader = (name, video) => {
  let preview = false;
  if (video) preview = Elem.video(video);
  const file = Elem.input({
    type: "file",
    id:"new_video",
    name: name,
    class: "d-none"
  });

  
  file.accept = "video/mp4, video/ogg, video/webm";
  file.addEventListener("change", () => handleFiles(file.files, label, file));

  const label = Elem.label(
    {
      class: "drop-area d-flex justify-content-center align-items-center mb-3"
    },
    null,
    preview ||
      Elem.icon({
        class: "fas fa-cloud-upload-alt text-large text-primary",
        style: "font-size:100pt; cursor:pointer"
      }),
    file
  );


  let dropArea = label;

  const preventDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  // Highlight drop area when item is dragged over it
  ["dragenter", "dragover"].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });
  ["dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  // Handle dropped files
  dropArea.addEventListener(
    "drop",
    e => handleDrop(e, label, file),
    false
  );

  function highlight(e) {
    dropArea.classList.add("highlight");
  }

  function unhighlight(e) {
    dropArea.classList.remove("highlight");
  }

  return label;
};

function handleDrop(e, label, file) {
  var dt = e.dataTransfer;
  var files = dt.files;
  handleFiles(files, label, file);
}

function handleFiles(files, label, file) {
  removeAll(label);
  Layout.spinner(file, label);
  files = [...files];
  files.forEach(f => previewFile(f, label, file));
}

function previewFile(f, label, file) {
  const reader = new FileReader();
  const video = d.createElement("video");
  const source = d.createElement("source");
  reader.readAsDataURL(f);
  reader.onloadend = () => {
    source.src = reader.result;
    source.className = "embed-responsive-item";
    video.className = "embed-responsive embed-responsive-4by3";
    video.controls = true;
    video.append(source);
    removeAll(label);
    label.append(file, video);
  };
}
