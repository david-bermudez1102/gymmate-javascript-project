class Picture {
  constructor(dropArea) {
    this._dropArea = dropArea;
  }

  get dropArea() {
    return this._dropArea;
  }

  static highlight(e) {
    this.dropArea.classList.add("highlight");
  }

  static unhighlight(e) {
    this.dropArea.classList.remove("highlight");
  }

  static handleDrop(e, label, file) {
    var dt = e.dataTransfer;
    var files = dt.files;
    this.handleFiles(files, label, file);
  }

  static handleFiles(files, label, file) {
    removeAll(label);
    Render.spinner(file, label);
    files = [...files];
    files.forEach(f => this.preview(f, label, file));
  }

  static preview(f, label, file) {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onloadend = () => {
      const img = Element.img({
        src: reader.result,
        style: "left: -50px;",
        width: "100%",
        draggable: false
      });

      const imgWrapper = Element.div(
        {
          class: "circular--landscape"
        },
        null,
        img
      );

      this.drag(img,imgWrapper)
      removeAll(label);
      label.append(file, imgWrapper);
    };
  }
  static drag(img, imgWrapper){
    let x = -50;
    let y = 0;
    img.addEventListener("mousedown", mouseDown, false);
    window.addEventListener("mouseup", mouseUp, false);

    function mouseUp() {
      window.removeEventListener("mousemove", divMove, true);
    }

    function mouseDown(e) {
      window.addEventListener("mousemove", divMove, true);
    }

    function divMove(e) {
      var bounds = imgWrapper.getBoundingClientRect();
      y = e.pageY - bounds.top;
      x = -50 + e.pageX - bounds.left;

      img.style.marginLeft = x + "px";
      img.style.marginTop = y + "px";
    }

  }
}
