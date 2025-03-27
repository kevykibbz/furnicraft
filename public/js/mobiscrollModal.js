class MobiscrollModal {
  constructor() {
    // Initialize Mobiscroll options
    mobiscroll.setOptions({
      locale: mobiscroll.localeEn,
      theme: "ios",
      themeVariant: "light",
    });

    // Create modal container if it doesn't exist
    if (!$("#mobiscroll-modal-container").length) {
      $("body").append(`
                <div id="mobiscroll-modal-container" style="display: none">
                    <div id="mobiscroll-modal">
                        <div class="mbsc-align-center">
                            <div class="mbsc-align-center mbsc-padding">
                                <div id="mobiscroll-modal-icon"></div>
                                <h4 id="mobiscroll-modal-title"></h4>
                                <p id="mobiscroll-modal-message"></p>
                            </div>
                            <div class="mbsc-button-group-block">
                                <button mbsc-button id="mobiscroll-modal-button">OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            `);
    }

    // Initialize the popup
    this.popup = $("#mobiscroll-modal")
      .mobiscroll()
      .popup({
        display: "bottom",
      })
      .mobiscroll("getInst");

    // Close button handler
    $("#mobiscroll-modal-button").on("click", () => {
      this.close();
    });
  }

  show(options) {
    // Default options
    const defaults = {
      type: "success",
      title: "",
      message: "",
      buttonText: "OK",
      buttonLink: null,
      onClose: null,
    };

    // Merge options with defaults
    const settings = { ...defaults, ...options };

    // Set modal content
    $("#mobiscroll-modal-title").text(settings.title);
    $("#mobiscroll-modal-message").text(settings.message);
    $("#mobiscroll-modal-button").text(settings.buttonText);

    // Set icon based on type
    const iconContainer = $("#mobiscroll-modal-icon");
    iconContainer.empty();

    if (settings.type === "success") {
      iconContainer.html(
        '<i class="mbsc-ic mbsc-ic-checkmark-circle" style="font-size: 48px; color: #4CAF50;"></i>'
      );
    } else if (settings.type === "error") {
      iconContainer.html(
        '<i class="mbsc-ic mbsc-ic-close-circle" style="font-size: 48px; color: #F44336;"></i>'
      );
    }

    // Update button click handler
    const button = $("#mobiscroll-modal-button");
    button.off("click"); // Remove previous handlers

    if (settings.buttonLink) {
      button.on("click", () => {
        window.location.href = settings.buttonLink;
      });
    } else {
      button.on("click", () => {
        this.close();
        if (settings.onClose) {
          settings.onClose();
        }
      });
    }

    // Open the modal
    this.popup.open();
  }

  close() {
    this.popup.close();
  }
}

// Create a singleton instance
const modal = new MobiscrollModal();

// Export the modal instance
export default modal;
