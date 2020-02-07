const fileUploader = name => {
  const label = d.createElement("label");
  const file = Input.new({
    type: "file",
    name: name,
    class: "d-none"
  });
  label.className = "drop-area d-flex justify-content-center align-items-center mb-3";
  label.append(
    Icon.new(
      "fas fa-cloud-upload-alt text-large text-primary",
      "font-size:100pt; cursor:pointer"
    ),
    file
  );
  file.accept = "video/mp4, video/ogg, video/webm";
  file.onchange = "handleFiles(this.files)";

  let dropArea = label;

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
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
  dropArea.addEventListener("drop", handleDrop, false);

  function highlight(e) {
    dropArea.classList.add("highlight");
  }

  function unhighlight(e) {
    dropArea.classList.remove("highlight");
  }

  function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
    removeAll(label);
    Render.spinner(file,label);
    handleFiles(files);
  }

  function handleFiles(files) {
    files = [...files];
    files.forEach(previewFile);
  }

  function previewFile(file) {
    const reader = new FileReader();
    const video = d.createElement("video");
    const source = d.createElement("source");
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      source.src = reader.result;
      source.className = "embed-responsive-item";
      video.className = "embed-responsive embed-responsive-4by3";
      video.controls = true;
      video.append(source);
      removeAll(label);
      label.append(video);
    };
  }

  return label;
};
