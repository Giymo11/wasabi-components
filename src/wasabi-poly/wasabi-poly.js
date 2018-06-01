class WasabiPoly extends Polymer.Element {



  static get is() {
    return 'wasabi-poly';
  }

  static get properties() {
    return { };
  }

  /**
   * Inital Constructor for the class
   *  ---
   * The custom elements v1 spec forbids reading attributes, children, or parent
   * information from the DOM API in the constructor
   * -- Note:
   * Always call super
   */
  constructor() {
    super();

    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({color: 0xFF0000});
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
  }



  /**
   * Life cycle function that gets called when the element is
   * first attached to the DOM
   **/
  connectedCallback() {
    super.connectedCallback();


    const width = this.offsetWidth;
    const height = this.offsetHeight;

    console.log('width: ' + width + ', height: ' + height);

    const params = {canvas: this.$.polyCanvas};

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer(params);
    this.renderer.setSize(width, height);
    console.log(params);

    this.camera.position.z = 5;

    let that = this;
    this.animate = function () {

      that.cube.rotation.x += 0.1;
      that.cube.rotation.y += 0.1;

      that.renderer.render(that.scene, that.camera);
      requestAnimationFrame(that.animate);
    };


    //this.appendChild(this.renderer.domElement);
    //document.body.appendChild(this.renderer.domElement);

    this.animate();

    Polymer.RenderStatus.beforeNextRender(this, function() {
      // measure something

    });

  }

  /**
   * Life cycle function that gets called when the element is
   * removed from the DOM
   **/
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * For Polymer elements, only properties explicitly declared in the
   * properties object are tracked for attribute changes.
   **/
  attributeChangedCallback() {

  }

  /**
   * ### Events
   */

  /**
   * Fired when fonts-one does something
   *
   * @event fonts-showcase-one-action
   */
};

customElements.define(WasabiPoly.is, WasabiPoly);
