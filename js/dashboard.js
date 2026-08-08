document.addEventListener("DOMContentLoaded", () => {
  // 1. Sidebar Navigation
  const navItems = document.querySelectorAll(".sidebar-nav-item");
  const dashPages = document.querySelectorAll(".dash-page");
  const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

  function navigateToPage(pageName) {
    navItems.forEach((item) => {
      if (item.getAttribute("data-page") === pageName) {
        item.classList.add("active");
        if (breadcrumbCurrent) {
          breadcrumbCurrent.textContent = item.textContent.trim();
        }
      } else {
        item.classList.remove("active");
      }
    });

    dashPages.forEach((page) => {
      const targetId =
        pageName.toLowerCase() === "sos"
          ? "pageSOS"
          : `page${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`;
      if (page.id === targetId) {
        page.classList.add("active");
      } else {
        page.classList.remove("active");
      }
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      if (item.classList.contains("logout-item")) {
        e.preventDefault();
        showToast(
          "Logged out successfully. Redirecting to login portal...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "index.html";
        }, 600);
        return;
      }
      e.preventDefault();
      const pageName = item.getAttribute("data-page");
      if (pageName) {
        navigateToPage(pageName);
      }
    });
  });

  // 2. Modal (New Screen)
  const newScreenModal = document.getElementById("newScreenModal");
  const openNewScreenModalBtns = document.querySelectorAll(
    '#openNewScreenModal, [data-action="new-screen"]',
  );
  const closeModalBtn = document.getElementById("closeModal");
  const pairScreenBtn = document.getElementById("pairScreenBtn");

  openNewScreenModalBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      // Automatically switch context to Screens page before opening modal overlay
      const activePage = document.querySelector(".dash-page.active");
      if (activePage && activePage.id !== "pageScreens") {
        navigateToPage("screens");
      }
      if (newScreenModal) {
        newScreenModal.classList.add("open");
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (newScreenModal) {
        newScreenModal.classList.remove("open");
      }
    });
  }

  // Close modal on overlay click
  if (newScreenModal) {
    newScreenModal.addEventListener("click", (e) => {
      if (e.target === newScreenModal) {
        newScreenModal.classList.remove("open");
      }
    });
  }

  // Pair screen logic
  if (pairScreenBtn) {
    pairScreenBtn.addEventListener("click", () => {
      const originalText = pairScreenBtn.textContent;
      pairScreenBtn.textContent = "Pairing...";
      pairScreenBtn.disabled = true;

      setTimeout(() => {
        pairScreenBtn.textContent = originalText;
        pairScreenBtn.disabled = false;
        if (newScreenModal) {
          newScreenModal.classList.remove("open");
        }
        showToast("Screen successfully paired!", "success");
      }, 1500);
    });
  }

  // Cancel modal button
  const cancelModalBtn = document.getElementById("cancelModal");
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener("click", () => {
      if (newScreenModal) newScreenModal.classList.remove("open");
    });
  }

  // 2.1 Wilyer Plan Selection Card Interactions
  const wilyerDemoPlanCards = document.querySelectorAll(
    ".wilyer-demo-plan-card",
  );
  wilyerDemoPlanCards.forEach((card) => {
    card.addEventListener("click", () => {
      wilyerDemoPlanCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  });

  // 3. Sort Dropdown (Playlists)
  const sortDropdownBtn = document.getElementById("sortDropdownBtn");
  const sortDropdownMenu = document.getElementById("sortDropdownMenu");

  if (sortDropdownBtn && sortDropdownMenu) {
    sortDropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sortDropdownMenu.classList.toggle("open");
    });

    const dropdownItems = sortDropdownMenu.querySelectorAll(".dropdown-item");
    dropdownItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const sortBtnText = document.getElementById("sortBtnText");
        if (sortBtnText)
          sortBtnText.textContent = item.getAttribute("data-sort");
        sortDropdownMenu.classList.remove("open");
      });
    });
  }

  // 4. Search (Playlists)
  const playlistSearch = document.getElementById("playlistSearch");
  const playlistCards = document.querySelectorAll(".playlist-card");

  if (playlistSearch) {
    playlistSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      playlistCards.forEach((card) => {
        const name = (card.getAttribute("data-name") || "").toLowerCase();
        if (name.includes(searchTerm)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // 5. Search (Screens)
  const screenSearch = document.getElementById("screenSearch");
  const screensTableBody = document.getElementById("screensTableBody");

  if (screenSearch && screensTableBody) {
    const rows = screensTableBody.querySelectorAll("tr");
    screenSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  // 6. Toast Notifications
  const toastContainer = document.getElementById("toastContainer");

  window.showToast = function (message, type = "success") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast-alert ${type}`;

    const icon = type === "success" ? "✓" : "⚠";

    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span>${message}</span>
            </div>
            <button class="toast-close-btn">&times;</button>
            <div class="toast-progress"></div>
        `;

    toastContainer.appendChild(toast);

    // Close button functionality
    const closeBtn = toast.querySelector(".toast-close-btn");
    closeBtn.addEventListener("click", () => {
      toast.remove();
    });

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s ease";
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toast.remove();
        }
      }, 300);
    }, 4000);
  };

  // 7. Card Overflow Menu
  const cardMenuBtns = document.querySelectorAll(".card-menu-btn");

  cardMenuBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Close other open menus
      document.querySelectorAll(".card-overflow-menu.open").forEach((menu) => {
        if (menu !== btn.nextElementSibling) {
          menu.classList.remove("open");
        }
      });
      const menu = btn.nextElementSibling;
      if (menu && menu.classList.contains("card-overflow-menu")) {
        menu.classList.toggle("open");
      }
    });
  });

  // Close menus/dropdowns when clicking outside
  document.addEventListener("click", () => {
    if (sortDropdownMenu) {
      sortDropdownMenu.classList.remove("open");
    }
    document.querySelectorAll(".card-overflow-menu.open").forEach((menu) => {
      menu.classList.remove("open");
    });
  });

  // 8. Dashboard Chip Filters (Last Response Distribution)
  const filterChips = document.querySelectorAll(".filter-chip");
  const distCards = document.querySelectorAll(".dist-card");

  function updatePeriodFilters() {
    const activePeriods = [];
    filterChips.forEach((chip) => {
      if (chip.classList.contains("active")) {
        const period = chip.getAttribute("data-period");
        if (period) activePeriods.push(period);
      }
    });

    if (activePeriods.length === 0) {
      distCards.forEach((card) => {
        card.style.display = "";
      });
    } else {
      distCards.forEach((card) => {
        const cardPeriod = card.getAttribute("data-period");
        if (activePeriods.includes(cardPeriod)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    }
  }

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      updatePeriodFilters();
    });
  });

  // Run initial filtering on load
  updatePeriodFilters();

  // 8.1 Group Screen Distribution Legend Filters
  const groupFilters = document.querySelectorAll(".legend-filter-chip");
  const groupRows = document.querySelectorAll("#groupDistributionTableBody tr");

  function updateGroupFilters() {
    const activeFilters = [];
    groupFilters.forEach((filter) => {
      if (filter.classList.contains("active")) {
        const type = filter.getAttribute("data-filter");
        if (type) activeFilters.push(type);
      }
    });

    if (activeFilters.length === 0) {
      groupRows.forEach((row) => {
        row.style.display = "";
      });
    } else {
      groupRows.forEach((row) => {
        let isMatch = false;
        const cells = row.querySelectorAll("td");
        if (cells.length >= 6) {
          activeFilters.forEach((filterName) => {
            if (filterName === "60min") {
              const val = cells[3].textContent.trim();
              if (val !== "-" && val !== "0") isMatch = true;
            }
            if (filterName === "3days") {
              const val = cells[4].textContent.trim();
              if (val !== "-" && val !== "0") isMatch = true;
            }
            if (filterName === "7days") {
              const val = cells[5].textContent.trim();
              if (val !== "-" && val !== "0") isMatch = true;
            }
          });
        }
        row.style.display = isMatch ? "" : "none";
      });
    }
  }

  groupFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filter.classList.toggle("active");
      updateGroupFilters();
    });
  });

  // Run initial filtering on load
  updateGroupFilters();

  // 9. View More Button
  const viewMoreScreensBtn = document.getElementById("viewMoreScreens");
  if (viewMoreScreensBtn) {
    viewMoreScreensBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigateToPage("screens");
    });
  }

  // 10. Screen Section Tabs Filtering (All, Deleted, Expired)
  const screenTabs = document.querySelectorAll(".screen-tab");
  const screensSectionTitle = document.getElementById("screensSectionTitle");
  const screensRows = document.querySelectorAll("#screensTableBody tr");

  screenTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      screenTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const tabType = tab.getAttribute("data-screen-tab");

      if (screensSectionTitle) {
        if (tabType === "all")
          screensSectionTitle.textContent = "ALL SCREENS (3)";
        else if (tabType === "deleted")
          screensSectionTitle.textContent = "DELETED SCREENS (0)";
        else if (tabType === "expired")
          screensSectionTitle.textContent = "EXPIRED SCREENS (3)";
      }

      screensRows.forEach((row) => {
        const rowType = row.getAttribute("data-type") || "";
        if (tabType === "all") {
          row.style.display = "";
        } else if (tabType === "deleted") {
          row.style.display = "none";
        } else if (tabType === "expired") {
          row.style.display = rowType.includes("expired") ? "" : "none";
        }
      });
    });
  });

  // ======================================================================
  // 11. NOTIFICATION MANAGEMENT INTERACTION LOGIC
  // ======================================================================

  const notifListView = document.getElementById("notifListView");
  const notifFormView = document.getElementById("notifFormView");
  const notifOnboardingBanner = document.getElementById(
    "notifOnboardingBanner",
  );

  let currentEditingRow = null;

  // Subview Switching Functions
  function showNotifListView() {
    if (notifFormView) notifFormView.classList.remove("active");
    if (notifListView) notifListView.classList.add("active");
  }

  function showNotifFormView(
    isEdit = false,
    ruleData = null,
    targetRow = null,
  ) {
    currentEditingRow = isEdit ? targetRow : null;

    if (notifListView) notifListView.classList.remove("active");
    if (notifFormView) notifFormView.classList.add("active");

    const breadcrumbTitle = document.getElementById("formViewBreadcrumbTitle");
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = isEdit
        ? "Edit Notification"
        : "Create Notification";
    }

    const saveNotifBtn = document.getElementById("saveNotifBtn");
    if (saveNotifBtn) {
      const btnText = saveNotifBtn.querySelector(".btn-text-dash");
      if (btnText)
        btnText.textContent = isEdit
          ? "Save Changes"
          : "Save Notification Rule";
    }

    if (!isEdit) {
      resetNotifForm();
    } else if (ruleData) {
      populateNotifForm(ruleData);
    }
  }

  // Create Notification Buttons
  const openCreateNotifBtn = document.getElementById("openCreateNotifBtn");
  const onboardingCreateBtn = document.getElementById("onboardingCreateBtn");
  const emptyStateCreateBtn = document.getElementById("emptyStateCreateBtn");
  const cancelNotifFormBtn = document.getElementById("cancelNotifFormBtn");

  [openCreateNotifBtn, onboardingCreateBtn, emptyStateCreateBtn].forEach(
    (btn) => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          showNotifFormView(false);
        });
      }
    },
  );

  if (cancelNotifFormBtn) {
    cancelNotifFormBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showNotifListView();
    });
  }

  // Save Notification Rule Submit Handler (Updates Table immediately)
  const saveNotifBtn = document.getElementById("saveNotifBtn");
  if (saveNotifBtn) {
    saveNotifBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("notifNameInput");
      if (!nameInput || !nameInput.value.trim()) {
        showToast("Please enter a Notification Name", "error");
        if (nameInput) nameInput.focus();
        return;
      }

      const name = nameInput.value.trim();
      const isReport = typeCardReport
        ? typeCardReport.classList.contains("selected")
        : true;
      const typeKey = isReport ? "report" : "alert";
      const typeName = isReport ? "Screen Report" : "Offline Incident Alert";
      const typeBadgeStyle = isReport
        ? "background:#1A6FF3;color:#FFFFFF;"
        : "background:#ef4444;color:#FFFFFF;";

      let scopeKey = "none";
      let scopeText = "Offline Incident";
      if (isReport) {
        const isOnline = btnScopeOnline
          ? btnScopeOnline.classList.contains("active")
          : true;
        scopeKey = isOnline ? "online" : "offline";
        scopeText = isOnline ? "Online Screens" : "Offline Screens";
      }

      let scheduleSummary = "";
      let subText = "";

      if (!isReport) {
        const threshSelect = document.getElementById("offlineThresholdSelect");
        const thresh = threshSelect ? threshSelect.value : "15 min";
        const isCustomHours = document.querySelector(
          'input[name="monitoringHoursRadio"][value="custom"]',
        )?.checked;
        let activeHours = "Active 24/7";
        if (isCustomHours) {
          const fromTime =
            document.getElementById("monitoringFromInput")?.value || "09:00";
          const toTime =
            document.getElementById("monitoringToInput")?.value || "20:00";
          activeHours = `Active ${fromTime}–${toTime}`;
        }
        scheduleSummary = `${thresh} threshold • ${activeHours}`;
        subText = `Threshold: ${thresh} • ${activeHours}`;
      } else {
        const isDaily =
          tabFreqDaily && tabFreqDaily.classList.contains("active");
        const isWeekly =
          tabFreqWeekly && tabFreqWeekly.classList.contains("active");
        subText = `Scope: ${scopeText}`;

        if (isDaily) {
          const times = Array.from(
            document.querySelectorAll('#dailyTimeList input[type="time"]'),
          ).map((i) => i.value);
          scheduleSummary = `Daily • ${times.join(", ") || "09:00, 18:00"}`;
        } else if (isWeekly) {
          const days = Array.from(
            document.querySelectorAll("#weeklyDayChips .day-chip.active"),
          ).map((c) => c.getAttribute("data-day"));
          scheduleSummary = `Weekly • ${days.join(", ") || "Mon, Wed, Fri"}`;
        } else {
          const dates = Array.from(selectedMonthlyDates);
          scheduleSummary = `Monthly • ${dates.length > 0 ? dates.map((d) => `Date ${d}`).join(", ") : "All Selected Dates"}`;
        }
      }

      // Recipients Summary
      const recipList = [];
      if (document.getElementById("chkMainAccountHolder")?.checked)
        recipList.push("Main User");
      document
        .querySelectorAll("#subUsersTagContainer .user-tag-chip")
        .forEach((c) => {
          const userVal =
            c.getAttribute("data-user") ||
            c.textContent.replace("×", "").trim();
          if (userVal) recipList.push(userVal);
        });
      document
        .querySelectorAll("#rolesTagContainer .role-tag-chip")
        .forEach((c) => {
          const clean = c.textContent.replace("×", "").trim();
          if (clean) recipList.push(clean);
        });
      const recipSummary =
        recipList.length > 0 ? recipList.join(", ") : "Main User";

      // Status
      const isStatusActive = notifFormStatusToggle
        ? notifFormStatusToggle.checked
        : true;
      const statusKey = isStatusActive ? "active" : "paused";
      const nowStr = "Just now";

      saveNotifBtn.classList.add("is-loading");
      saveNotifBtn.disabled = true;

      setTimeout(() => {
        saveNotifBtn.classList.remove("is-loading");
        saveNotifBtn.disabled = false;

        const notifCardGrid = document.getElementById("notifCardGrid");

        if (currentEditingRow) {
          // UPDATE EXISTING CARD
          const card = currentEditingRow;
          card.setAttribute("data-name", name);
          card.setAttribute("data-type", typeKey);
          card.setAttribute("data-scope", scopeKey);
          card.setAttribute("data-status", statusKey);

          const nameEl = card.querySelector(".notif-card-title");
          if (nameEl) nameEl.textContent = name;

          const typePill = card.querySelector(".notif-type-pill");
          if (typePill) {
            typePill.textContent = isReport
              ? "Screen Report"
              : "Offline Incident";
            typePill.className = `chip-badge notif-type-pill ${isReport ? "report" : "alert"}`;
          }

          const iconBox = card.querySelector(".notif-card-icon-box");
          if (iconBox) {
            iconBox.className = `notif-card-icon-box ${isReport ? "blue" : "red"}`;
            iconBox.innerHTML = isReport
              ? `<i class="ph ph-monitor" style="color: #1A6FF3;"></i>`
              : `<i class="ph ph-warning" style="color: #EF4444;"></i>`;
          }

          const schedVal = card.querySelector(".schedule-val");
          if (schedVal) schedVal.textContent = scheduleSummary;

          const recipVal = card.querySelector(".recipients-val");
          if (recipVal) recipVal.textContent = recipSummary;

          const lastmodVal = card.querySelector(".lastmod-val");
          if (lastmodVal) lastmodVal.textContent = "Just now";

          const toggleInput = card.querySelector(".notif-status-toggle");
          if (toggleInput) toggleInput.checked = isStatusActive;

          const statusBadge = card.querySelector(".notif-card-status-badge");
          if (statusBadge) {
            statusBadge.textContent = isStatusActive ? "ACTIVE" : "PAUSED";
            statusBadge.className = `chip-badge notif-card-status-badge ${isStatusActive ? "active" : "paused"}`;
          }

          showToast("Notification rule updated successfully!", "success");
        } else if (notifCardGrid) {
          // CREATE NEW CARD
          const newId = `rule-${Date.now()}`;
          const newCard = document.createElement("div");
          newCard.className = "notif-card";
          newCard.setAttribute("data-id", newId);
          newCard.setAttribute("data-type", typeKey);
          newCard.setAttribute("data-scope", scopeKey);
          newCard.setAttribute("data-status", statusKey);
          newCard.setAttribute("data-name", name);

          newCard.innerHTML = `
                      <div class="notif-card-header">
                        <div class="notif-card-title-group">
                          <div class="notif-card-icon-box ${isReport ? "blue" : "red"}">
                            ${
                              isReport
                                ? `<i class="ph ph-monitor" style="color: #1A6FF3;"></i>`
                                : `<i class="ph ph-warning" style="color: #EF4444;"></i>`
                            }
                          </div>
                          <h3 class="notif-card-title">${name}</h3>
                        </div>
                        <div class="notif-card-status-col">
                          <span class="chip-badge notif-card-status-badge ${isStatusActive ? "active" : "paused"}">${isStatusActive ? "ACTIVE" : "PAUSED"}</span>
                          <label class="toggle-switch" title="Toggle Active / Paused">
                            <input type="checkbox" class="notif-status-toggle" ${isStatusActive ? "checked" : ""} data-id="${newId}">
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>

                      <div class="notif-card-type-row">
                        <span class="chip-badge notif-type-pill ${isReport ? "report" : "alert"}">${isReport ? "Screen Report" : "Offline Incident"}</span>
                      </div>

                      <div class="notif-card-body" data-action="view-card">
                        <div class="notif-card-field">
                          <div class="notif-field-label">SCHEDULE</div>
                          <div class="notif-field-pill">
                            <i class="ph ph-clock" style="color: #1A6FF3;"></i>
                            <span class="notif-field-value schedule-val">${scheduleSummary}</span>
                          </div>
                        </div>
                        <div class="notif-card-field">
                          <div class="notif-field-label">RECIPIENTS</div>
                          <div class="notif-field-pill">
                            <i class="ph ph-users" style="color: #1A6FF3;"></i>
                            <span class="notif-field-value recipients-val">${recipSummary}</span>
                          </div>
                        </div>
                        <div class="notif-card-field">
                          <div class="notif-field-label">LAST MODIFIED</div>
                          <div class="notif-field-inline">
                            <i class="ph ph-calendar" style="color: #6E6F71;"></i>
                            <span class="lastmod-val">Just now</span>
                          </div>
                        </div>
                      </div>

                      <div class="notif-card-actions">
                        <button type="button" class="notif-card-action-btn notif-action-edit" data-id="${newId}">
                          <i class="ph ph-pencil-simple"></i>
                          <span>Edit</span>
                        </button>
                        <button type="button" class="notif-card-action-btn notif-action-dup" data-id="${newId}">
                          <i class="ph ph-copy"></i>
                          <span>Duplicate</span>
                        </button>
                        <button type="button" class="notif-card-action-btn notif-action-del" data-id="${newId}">
                          <i class="ph ph-trash"></i>
                          <span>Delete</span>
                        </button>
                      </div>
                    `;

          notifCardGrid.prepend(newCard);

          // Ensure card container is visible
          const notifCardContainer =
            document.getElementById("notifCardContainer");
          const notifEmptyStateCard = document.getElementById(
            "notifEmptyStateCard",
          );
          if (notifCardContainer) notifCardContainer.style.display = "block";
          if (notifEmptyStateCard) notifEmptyStateCard.style.display = "none";

          showToast("Notification rule saved successfully!", "success");
        }

        currentEditingRow = null;
        showNotifListView();
        filterNotifGrid();
      }, 600);
    });
  }

  // Preset State Switcher (Populated, Empty, Loading, Error)
  const presetStateSwitcher = document.getElementById("presetStateSwitcher");
  const notifCardContainer = document.getElementById("notifCardContainer");
  const notifEmptyStateCard = document.getElementById("notifEmptyStateCard");
  const notifLoadingStateCard = document.getElementById(
    "notifLoadingStateCard",
  );
  const notifErrorStateCard = document.getElementById("notifErrorStateCard");

  if (presetStateSwitcher) {
    presetStateSwitcher.addEventListener("change", (e) => {
      const val = e.target.value;
      [
        notifCardContainer,
        notifEmptyStateCard,
        notifLoadingStateCard,
        notifErrorStateCard,
      ].forEach((card) => {
        if (card) card.style.display = "none";
      });

      if (val === "populated" && notifCardContainer)
        notifCardContainer.style.display = "block";
      else if (val === "empty" && notifEmptyStateCard)
        notifEmptyStateCard.style.display = "block";
      else if (val === "loading" && notifLoadingStateCard)
        notifLoadingStateCard.style.display = "block";
      else if (val === "error" && notifErrorStateCard)
        notifErrorStateCard.style.display = "block";
    });
  }

  const notifRetryBtn = document.getElementById("notifRetryBtn");
  if (notifRetryBtn && presetStateSwitcher) {
    notifRetryBtn.addEventListener("click", () => {
      presetStateSwitcher.value = "populated";
      presetStateSwitcher.dispatchEvent(new Event("change"));
      showToast("Reconnected successfully!", "success");
    });
  }

  // Filter & Search Controls for Notification Cards Grid
  const notifSearchInput = document.getElementById("notifSearchInput");
  const notifTypeFilter = document.getElementById("notifTypeFilter");
  const notifScopeFilter = document.getElementById("notifScopeFilter");
  const notifStatusFilter = document.getElementById("notifStatusFilter");
  const notifSortFilter = document.getElementById("notifSortFilter");

  if (notifTypeFilter && notifScopeFilter) {
    notifTypeFilter.addEventListener("change", () => {
      const type = notifTypeFilter.value;
      notifScopeFilter.innerHTML = "";

      if (type === "all") {
        notifScopeFilter.disabled = true;
        notifScopeFilter.innerHTML =
          '<option value="disabled">Select Notification Type</option>';
      } else if (type === "report") {
        notifScopeFilter.disabled = false;
        notifScopeFilter.innerHTML = `
                    <option value="all">All Screens</option>
                    <option value="online">Online Screens</option>
                    <option value="offline">Offline Screens</option>
                `;
      } else if (type === "alert") {
        notifScopeFilter.disabled = true;
        notifScopeFilter.innerHTML =
          '<option value="disabled">This filter is only available for Screen Reports.</option>';
      }
      filterNotifGrid();
    });
  }

  function filterNotifGrid() {
    const searchTerm = (
      notifSearchInput ? notifSearchInput.value : ""
    ).toLowerCase();
    const selectedType = notifTypeFilter ? notifTypeFilter.value : "all";
    const selectedScope = notifScopeFilter ? notifScopeFilter.value : "all";
    const selectedStatus = notifStatusFilter ? notifStatusFilter.value : "all";

    const liveCards = document.querySelectorAll("#notifCardGrid .notif-card");
    let visibleCount = 0;

    liveCards.forEach((card) => {
      const name = (card.getAttribute("data-name") || "").toLowerCase();
      const type = card.getAttribute("data-type");
      const scope = card.getAttribute("data-scope");
      const status = card.getAttribute("data-status");

      const matchSearch = name.includes(searchTerm);
      const matchType = selectedType === "all" || type === selectedType;
      const matchScope =
        selectedScope === "all" ||
        selectedScope === "disabled" ||
        scope === selectedScope;
      const matchStatus = selectedStatus === "all" || status === selectedStatus;

      if (matchSearch && matchType && matchScope && matchStatus) {
        card.style.display = "";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    const subtitle = document.getElementById("notifGridSubtitle");
    if (subtitle)
      subtitle.textContent = `Showing ${visibleCount} notification rule${visibleCount === 1 ? "" : "s"}`;

    if (visibleCount === 0) {
      if (notifCardContainer) notifCardContainer.style.display = "none";
      if (notifEmptyStateCard) notifEmptyStateCard.style.display = "block";
    } else {
      if (notifCardContainer) notifCardContainer.style.display = "block";
      if (notifEmptyStateCard) notifEmptyStateCard.style.display = "none";
    }
  }

  // ======================================================================
  // NOTIFICATION CARD ACTIONS HANDLER (DETAILS, EDIT, DUPLICATE, DELETE, TOGGLE)
  // ======================================================================

  const notificationDetailsModal = document.getElementById(
    "notificationDetailsModal",
  );
  const closeNotifDetailModal = document.getElementById(
    "closeNotifDetailModal",
  );
  const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
  const editFromDetailModalBtn = document.getElementById(
    "editFromDetailModalBtn",
  );
  let activeDetailCard = null;

  function openDetailModal(card) {
    if (!card || !notificationDetailsModal) return;
    activeDetailCard = card;

    const name =
      card.getAttribute("data-name") ||
      card.querySelector(".notif-card-title")?.textContent.trim() ||
      "Notification Rule";
    const type =
      card.getAttribute("data-type") === "alert"
        ? "Offline Incident Alert"
        : "Screen Report";
    const schedule =
      card.querySelector(".schedule-val")?.textContent.trim() ||
      "Daily Schedule";
    const recipients =
      card.querySelector(".recipients-val")?.textContent.trim() || "Main User";
    const isStatusActive =
      card.getAttribute("data-status") === "active" ||
      card.querySelector(".notif-status-toggle")?.checked;

    const elName = document.getElementById("detailNotifName");
    const elType = document.getElementById("detailNotifType");
    const elScope = document.getElementById("detailNotifScope");
    const elSchedule = document.getElementById("detailNotifSchedule");
    const elRecip = document.getElementById("detailNotifRecipients");
    const elBadge = document.getElementById("detailNotifStatusBadge");

    if (elName) elName.textContent = name;
    if (elType) elType.textContent = `Type: ${type}`;
    if (elScope)
      elScope.textContent = `Scope: ${card.getAttribute("data-scope") || "All Screens"}`;
    if (elSchedule) elSchedule.textContent = schedule;
    if (elRecip) elRecip.textContent = recipients;

    if (elBadge) {
      elBadge.textContent = isStatusActive ? "ACTIVE" : "PAUSED";
      elBadge.className = `chip-badge notif-card-status-badge ${isStatusActive ? "active" : "paused"}`;
    }

    notificationDetailsModal.classList.add("open");
  }

  function closeDetailModal() {
    if (notificationDetailsModal)
      notificationDetailsModal.classList.remove("open");
  }

  [closeNotifDetailModal, closeDetailModalBtn].forEach((btn) => {
    if (btn) btn.addEventListener("click", closeDetailModal);
  });

  if (notificationDetailsModal) {
    notificationDetailsModal.addEventListener("click", (e) => {
      if (e.target === notificationDetailsModal) closeDetailModal();
    });
  }

  if (editFromDetailModalBtn) {
    editFromDetailModalBtn.addEventListener("click", () => {
      closeDetailModal();
      if (activeDetailCard) {
        const name = activeDetailCard.getAttribute("data-name");
        const type = activeDetailCard.getAttribute("data-type");
        showNotifFormView(true, { name, type }, activeDetailCard);
      }
    });
  }

  // Global Click Listener for Card Action Buttons and Card Body
  document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".notif-action-edit");
    const dupBtn = e.target.closest(".notif-action-dup");
    const delBtn = e.target.closest(".notif-action-del");
    const bodyCard = e.target.closest(".notif-card-body");
    const statusToggle = e.target.closest(".toggle-switch");

    if (editBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = editBtn.closest(".notif-card");
      const name =
        card.getAttribute("data-name") ||
        card.querySelector(".notif-card-title")?.textContent.trim();
      const type = card.getAttribute("data-type") || "report";
      showNotifFormView(true, { name, type }, card);
    } else if (dupBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = dupBtn.closest(".notif-card");
      const name = card.getAttribute("data-name") || "Notification Rule";
      const cloneCard = card.cloneNode(true);
      const newId = `rule-${Date.now()}`;
      const dupName = `${name} (Copy)`;

      cloneCard.setAttribute("data-id", newId);
      cloneCard.setAttribute("data-name", dupName);
      const titleEl = cloneCard.querySelector(".notif-card-title");
      if (titleEl) titleEl.textContent = dupName;

      const toggle = cloneCard.querySelector(".notif-status-toggle");
      if (toggle) toggle.setAttribute("data-id", newId);

      const notifCardGrid = document.getElementById("notifCardGrid");
      if (notifCardGrid) {
        notifCardGrid.insertBefore(cloneCard, card.nextSibling);
        showToast(`Duplicated "${dupName}" successfully!`, "success");
        filterNotifGrid();
      }
    } else if (delBtn) {
      e.preventDefault();
      e.stopPropagation();
      const card = delBtn.closest(".notif-card");
      const name = card.getAttribute("data-name") || "Notification Rule";

      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        card.remove();
        showToast(`Deleted "${name}" successfully!`, "success");
        filterNotifGrid();
      }
    } else if (bodyCard && !statusToggle) {
      e.preventDefault();
      const card = bodyCard.closest(".notif-card");
      openDetailModal(card);
    }
  });

  // Card Status Toggle Listener (Works inline without opening the card)
  document.addEventListener("change", (e) => {
    if (e.target && e.target.classList.contains("notif-status-toggle")) {
      const card = e.target.closest(".notif-card");
      const isChecked = e.target.checked;
      if (card) {
        card.setAttribute("data-status", isChecked ? "active" : "paused");
        const badge = card.querySelector(".notif-card-status-badge");
        if (badge) {
          badge.textContent = isChecked ? "ACTIVE" : "PAUSED";
          badge.className = `chip-badge notif-card-status-badge ${isChecked ? "active" : "paused"}`;
        }
      }
      showToast(
        `Notification rule ${isChecked ? "enabled" : "paused"}.`,
        "success",
      );
    }
  });

  [
    notifSearchInput,
    notifScopeFilter,
    notifStatusFilter,
    notifSortFilter,
  ].forEach((el) => {
    if (el) el.addEventListener("change", filterNotifGrid);
    if (el && el.tagName === "INPUT")
      el.addEventListener("input", filterNotifGrid);
  });

  // ======================================================================
  // 12. REFINED FORM INTERACTION LOGIC
  // ======================================================================

  // Notification Type Cards Selection
  const typeCardReport = document.getElementById("typeCardReport");
  const typeCardAlert = document.getElementById("typeCardAlert");
  const reportScopeCard = document.getElementById("reportScopeCard");
  const reportConfigSection = document.getElementById("reportConfigSection");
  const alertConfigSection = document.getElementById("alertConfigSection");
  const typeReportRadio = document.getElementById("typeReport");
  const typeAlertRadio = document.getElementById("typeAlert");
  // New refs for restructured form sections
  const schedulingSection = document.getElementById("schedulingSection");
  const routingHelpAccordionWrapper = document.getElementById(
    "routingHelpAccordionWrapper",
  );
  const reportPayloadSection = document.getElementById("reportPayloadSection");
  const alertPayloadSection = document.getElementById("alertPayloadSection");
  const notifStatusTitle = document.getElementById("notifStatusTitle");
  const notifStatusDesc = document.getElementById("notifStatusDesc");
  const notifStatusChip = document.getElementById("notifStatusChip");
  const recipientsSectionLabel = document.getElementById(
    "recipientsSectionLabel",
  );
  const infoShareSectionLabel = document.getElementById(
    "infoShareSectionLabel",
  );
  let reportStatusEnabled = true;
  let alertStatusEnabled = true;

  function selectNotifType(type) {
    const isReport = type === "report";

    // Restore individual status state
    const statusToggle = document.getElementById("notifFormStatusToggle");
    if (statusToggle) {
      statusToggle.checked = isReport
        ? reportStatusEnabled
        : alertStatusEnabled;
      if (notifStatusChip) {
        const checked = statusToggle.checked;
        notifStatusChip.textContent = checked ? "Enabled" : "Paused";
        notifStatusChip.style.background = checked ? "#ECFDF5" : "#F1F5F9";
        notifStatusChip.style.color = checked ? "#047857" : "#64748B";
        notifStatusChip.style.borderColor = checked
          ? "#A7F3D0"
          : "rgba(20,83,182,0.2)";
      }
    }

    if (isReport) {
      if (typeCardReport) typeCardReport.classList.add("selected");
      if (typeCardAlert) typeCardAlert.classList.remove("selected");
      if (typeCardReport)
        typeCardReport.querySelector(".notif-type-icon").className =
          "notif-type-icon primary";
      if (typeCardAlert)
        typeCardAlert.querySelector(".notif-type-icon").className =
          "notif-type-icon gray";
      if (typeReportRadio) typeReportRadio.checked = true;
      // Show/hide sections
      if (reportScopeCard) reportScopeCard.style.display = "block";
      if (alertConfigSection) alertConfigSection.style.display = "none";
      if (schedulingSection) schedulingSection.style.display = "block";
      // Show routing help accordion for Screen Report
      if (routingHelpAccordionWrapper)
        routingHelpAccordionWrapper.style.display = "block";
      // Swap payload sections
      if (reportPayloadSection) reportPayloadSection.style.display = "block";
      if (alertPayloadSection) alertPayloadSection.style.display = "none";
      // Update status section title and description
      if (notifStatusTitle) notifStatusTitle.textContent = "Report Status";
      if (notifStatusDesc)
        notifStatusDesc.textContent =
          "Enable or pause scheduled report delivery.";
      // Update section numbers for Screen Report flow
      if (recipientsSectionLabel)
        recipientsSectionLabel.textContent = "5. Recipients";
      if (infoShareSectionLabel)
        infoShareSectionLabel.textContent = "6. Information to Share";
    } else {
      if (typeCardAlert) typeCardAlert.classList.add("selected");
      if (typeCardReport) typeCardReport.classList.remove("selected");
      if (typeCardAlert)
        typeCardAlert.querySelector(".notif-type-icon").className =
          "notif-type-icon primary";
      if (typeCardReport)
        typeCardReport.querySelector(".notif-type-icon").className =
          "notif-type-icon gray";
      if (typeAlertRadio) typeAlertRadio.checked = true;
      // Show/hide sections
      if (reportScopeCard) reportScopeCard.style.display = "none";
      if (alertConfigSection) alertConfigSection.style.display = "block";
      if (schedulingSection) schedulingSection.style.display = "none";
      // Hide routing help accordion for Offline Incident
      if (routingHelpAccordionWrapper)
        routingHelpAccordionWrapper.style.display = "none";
      // Swap payload sections
      if (reportPayloadSection) reportPayloadSection.style.display = "none";
      if (alertPayloadSection) alertPayloadSection.style.display = "block";
      // Update status section title and description
      if (notifStatusTitle)
        notifStatusTitle.textContent = "Incident Monitoring Status";
      if (notifStatusDesc)
        notifStatusDesc.textContent =
          "Enable or pause real-time offline incident detection and alerts.";
      // Update section numbers for Offline Incident flow
      if (recipientsSectionLabel)
        recipientsSectionLabel.textContent = "5. Recipients";
      if (infoShareSectionLabel)
        infoShareSectionLabel.textContent = "6. Information to Share";
    }
  }

  if (typeCardReport)
    typeCardReport.addEventListener("click", () => selectNotifType("report"));
  if (typeCardAlert)
    typeCardAlert.addEventListener("click", () => selectNotifType("alert"));

  const routingAccordion = document.getElementById("routingAccordion");
  const toggleRoutingAccordionBtn = document.getElementById(
    "toggleRoutingAccordionBtn",
  );

  if (routingAccordion && toggleRoutingAccordionBtn) {
    // Start collapsed by default
    routingAccordion.classList.remove("open");
    toggleRoutingAccordionBtn.textContent = "Show ";
    const icon = document.createElement("span");
    icon.className = "toggle-icon";
    icon.textContent = "+";
    toggleRoutingAccordionBtn.appendChild(icon);

    toggleRoutingAccordionBtn.addEventListener("click", () => {
      const isOpen = routingAccordion.classList.toggle("open");
      toggleRoutingAccordionBtn.textContent = isOpen ? "Hide " : "Show ";
      toggleRoutingAccordionBtn.appendChild(icon);
    });
  }

  // Monitoring Hours Radio Toggle for Offline Incident Alert Configuration
  const monitoringHoursRadios = document.querySelectorAll(
    'input[name="monitoringHoursRadio"]',
  );
  const customHoursContainer = document.getElementById("customHoursContainer");

  monitoringHoursRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (customHoursContainer) {
        const isCustom = e.target.value === "custom";
        customHoursContainer.style.display = isCustom ? "flex" : "none";
      }
    });
  });

  const mockUsers = [
    { name: "Rahul Sharma", email: "rahul@wilyer.com", location: "Delhi Zone" },
    {
      name: "Simran Kaur",
      email: "simran@wilyer.com",
      location: "Mumbai Zone",
    },
    {
      name: "Raju Rastogi",
      email: "raju@wilyer.com",
      location: "Bangalore Zone",
    },
    {
      name: "Amit Patel",
      email: "amit@wilyer.com",
      location: "Ahmedabad Zone",
    },
    { name: "Priya Nair", email: "priya@wilyer.com", location: "Chennai Zone" },
  ];

  const mockRoles = [
    { label: "Store Manager" },
    { label: "Branch Manager" },
    { label: "Operations Lead" },
    { label: "Field Technician" },
    { label: "Security Admin" },
  ];

  function createRichUserChip(email) {
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    ) || {
      name: email.split("@")[0],
      email: email,
      location: "External User",
    };
    const initial = user.name.charAt(0).toUpperCase();

    const chip = document.createElement("span");
    chip.className = "user-tag-chip";
    chip.setAttribute("data-user", user.email);
    chip.innerHTML = `
            <div class="user-avatar-circle mini">${initial}</div>
            <div class="user-chip-info">
                <div class="user-chip-name">${user.name}</div>
                <div class="user-chip-sub">${user.email}</div>
            </div>
            <button type="button" class="tag-close-btn remove-user-tag">&times;</button>
        `;
    return chip;
  }

  function resetNotifForm() {
    const nameInput = document.getElementById("notifNameInput");
    if (nameInput) nameInput.value = "";

    reportStatusEnabled = true;
    alertStatusEnabled = true;

    // Default to report type
    selectNotifType("report");

    // Status
    const statusToggle = document.getElementById("notifFormStatusToggle");
    if (statusToggle) {
      statusToggle.checked = true;
      statusToggle.dispatchEvent(new Event("change"));
    }

    // Scope
    if (btnScopeOnline) {
      btnScopeOnline.classList.add("active");
    }
    if (btnScopeOffline) {
      btnScopeOffline.classList.remove("active");
    }

    // Frequency tab
    selectFreqTab("daily");

    // Daily Time List
    const dailyTimeList = document.getElementById("dailyTimeList");
    if (dailyTimeList) {
      dailyTimeList.innerHTML = `
              <div class="time-picker-row" style="background:#F8FAFC;padding:12px 16px;border-radius:10px;border:1px solid rgba(20,83,182,0.15);justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:10px;">
                  <i class="ph ph-clock" style="color:#1A6FF3;font-size:16px"></i>
                  <input type="time" value="09:00" class="daily-time-input" style="height:38px;border-radius:8px;padding:0 12px;border:1px solid rgba(20,83,182,0.3);font-size:14px;font-weight:600;">
                </div>
                <button type="button" class="tag-close-btn remove-time-btn" title="Remove time" style="font-size:18px;"><i class="ph ph-trash-simple"></i></button>
              </div>
              <div class="time-picker-row" style="background:#F8FAFC;padding:12px 16px;border-radius:10px;border:1px solid rgba(20,83,182,0.15);justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:10px;">
                  <i class="ph ph-clock" style="color:#1A6FF3;font-size:16px"></i>
                  <input type="time" value="18:00" class="daily-time-input" style="height:38px;border-radius:8px;padding:0 12px;border:1px solid rgba(20,83,182,0.3);font-size:14px;font-weight:600;">
                </div>
                <button type="button" class="tag-close-btn remove-time-btn" title="Remove time" style="font-size:18px;"><i class="ph ph-trash-simple"></i></button>
              </div>
            `;
      const dailyTimesBadge = document.getElementById("dailyTimesBadge");
      if (dailyTimesBadge) dailyTimesBadge.textContent = "2 Times Daily";
    }

    // Weekly schedule
    weeklyDayData.clear();
    renderWeeklyScheduleUI();

    // Monthly schedule
    selectedMonthlyDates.clear();
    customizedMonthlyDates.clear();
    renderMonthlyDatesGrid();

    // Alert Config
    const threshSelect = document.getElementById("offlineThresholdSelect");
    if (threshSelect) {
      threshSelect.value = "15 min";
      threshSelect.disabled = false;
    }

    const hoursRadio24 = document.querySelector(
      'input[name="monitoringHoursRadio"][value="24x7"]',
    );
    if (hoursRadio24) {
      hoursRadio24.checked = true;
      hoursRadio24.dispatchEvent(new Event("change"));
    }
    if (customHoursContainer) customHoursContainer.style.display = "none";

    const fromInput = document.getElementById("monitoringFromInput");
    if (fromInput) fromInput.value = "09:00";
    const toInput = document.getElementById("monitoringToInput");
    if (toInput) toInput.value = "20:00";

    // Recipients
    const chkMain = document.getElementById("chkMainAccountHolder");
    if (chkMain) chkMain.checked = true;

    // Clear sub-users except search input
    if (subUsersTagContainer) {
      subUsersTagContainer
        .querySelectorAll(".user-tag-chip")
        .forEach((c) => c.remove());
    }
    // Clear roles except search input
    if (rolesTagContainer) {
      rolesTagContainer
        .querySelectorAll(".role-tag-chip")
        .forEach((c) => c.remove());
    }
    updateTagCounts();

    // Payloads
    resetPayloadCheckboxes();
  }

  function resetPayloadCheckboxes() {
    // Report checkboxes
    document
      .querySelectorAll('#reportPayloadSection input[type="checkbox"]')
      .forEach((cb) => {
        if (cb.classList.contains("select-all-payload")) {
          const group = cb.getAttribute("data-group");
          cb.checked = group === "location" || group === "screen";
        } else {
          const name = cb.name;
          const val = cb.value;
          if (name === "payloadLocation") {
            cb.checked = val === "City" || val === "State";
          } else if (name === "payloadScreen") {
            cb.checked =
              val === "Screen Name" ||
              val === "Screen ID" ||
              val === "Status" ||
              val === "Last Response";
          } else if (name === "payloadDevice") {
            cb.checked = val === "IP Address" || val === "Device Time";
          }
        }
      });

    // Alert checkboxes
    document
      .querySelectorAll('#alertPayloadSection input[type="checkbox"]')
      .forEach((cb) => {
        if (cb.classList.contains("select-all-payload")) {
          cb.checked = true;
        } else {
          const name = cb.name;
          const val = cb.value;
          if (name === "payloadAlertScreen") {
            cb.checked =
              val === "Screen Name" ||
              val === "Group Location" ||
              val === "Screen Status";
          } else if (name === "payloadAlertIncident") {
            cb.checked = true;
          }
        }
      });
  }

  function populateNotifForm(ruleData) {
    resetNotifForm(); // start with clean slate

    const card = currentEditingRow;
    if (!card) return;

    const name = card.getAttribute("data-name") || "";
    const type = card.getAttribute("data-type") || "report";
    const scope = card.getAttribute("data-scope") || "online";
    const status = card.getAttribute("data-status") || "paused";

    if (type === "report") {
      reportStatusEnabled = status === "active";
    } else {
      alertStatusEnabled = status === "active";
    }

    const nameInput = document.getElementById("notifNameInput");
    if (nameInput) nameInput.value = name;

    selectNotifType(type);

    const statusToggle = document.getElementById("notifFormStatusToggle");
    if (statusToggle) {
      statusToggle.checked = status === "active";
      statusToggle.dispatchEvent(new Event("change"));
    }

    if (type === "report") {
      if (btnScopeOnline && btnScopeOffline) {
        if (scope === "offline") {
          btnScopeOnline.classList.remove("active");
          btnScopeOffline.classList.add("active");
        } else {
          btnScopeOnline.classList.add("active");
          btnScopeOffline.classList.remove("active");
        }
      }

      // Parse schedule
      const schedText = card.querySelector(".schedule-val")?.textContent || "";
      if (schedText.startsWith("Daily")) {
        selectFreqTab("daily");
        // parse times: e.g. "Daily • 09:00, 18:00"
        const parts = schedText.split("•");
        if (parts[1]) {
          const times = parts[1].split(",").map((t) => t.trim());
          const dailyTimeList = document.getElementById("dailyTimeList");
          if (dailyTimeList && times.length > 0) {
            dailyTimeList.innerHTML = "";
            times.forEach((tVal) => {
              dailyTimeList.innerHTML += `
                              <div class="time-picker-row" style="background:#F8FAFC;padding:12px 16px;border-radius:10px;border:1px solid rgba(20,83,182,0.15);justify-content:space-between;">
                                <div style="display:flex;align-items:center;gap:10px;">
                                  <i class="ph ph-clock" style="color:#1A6FF3;font-size:16px"></i>
                                  <input type="time" value="${tVal}" class="daily-time-input" style="height:38px;border-radius:8px;padding:0 12px;border:1px solid rgba(20,83,182,0.3);font-size:14px;font-weight:600;">
                                </div>
                                <button type="button" class="tag-close-btn remove-time-btn" title="Remove time" style="font-size:18px;"><i class="ph ph-trash-simple"></i></button>
                              </div>
                            `;
            });
            const dailyTimesBadge = document.getElementById("dailyTimesBadge");
            if (dailyTimesBadge)
              dailyTimesBadge.textContent = `${times.length} Time${times.length === 1 ? "" : "s"} Daily`;
          }
        }
      } else if (schedText.startsWith("Weekly")) {
        selectFreqTab("weekly");
        // parse days: e.g. "Weekly • Mon, Wed, Fri"
        const parts = schedText.split("•");
        if (parts[1]) {
          const days = parts[1].split(",").map((d) => d.trim());
          weeklyDayData.clear();
          days.forEach((dayKey) => {
            if (dayOrder.includes(dayKey)) {
              weeklyDayData.set(dayKey, { enabled: true, times: ["09:00"] });
            }
          });
          renderWeeklyScheduleUI();
        }
      } else if (schedText.startsWith("Monthly")) {
        selectFreqTab("monthly");
        // parse dates: e.g. "Monthly • 1st, 15th, Last Day" or "Monthly • Date 1, Date 15"
        const parts = schedText.split("•");
        if (parts[1]) {
          const datesRaw = parts[1].split(",").map((d) => d.trim());
          selectedMonthlyDates.clear();
          customizedMonthlyDates.clear();
          datesRaw.forEach((raw) => {
            const num = parseInt(raw.replace(/[^0-9]/g, ""));
            if (!isNaN(num)) {
              selectedMonthlyDates.add(num);
              customizedMonthlyDates.set(num, {
                enabled: true,
                times: ["09:00"],
              });
            }
          });
          renderMonthlyDatesGrid();
        }
      }
    } else {
      // alert type
      const schedText = card.querySelector(".schedule-val")?.textContent || "";
      // parse: e.g. "30 min threshold • Active 22:00–06:00" or "10 min threshold • Active 24/7" or "15 min threshold • Active 24x7"
      let threshold = "15 min";
      if (schedText.includes("threshold")) {
        threshold = schedText.split("threshold")[0].trim();
      }
      const threshSelect = document.getElementById("offlineThresholdSelect");
      if (threshSelect) {
        // normalize threshold values
        if (threshold.includes("5")) threshSelect.value = "5 min";
        else if (threshold.includes("15")) threshSelect.value = "15 min";
        else if (threshold.includes("30")) threshSelect.value = "30 min";
        else if (threshold.includes("1 hour") || threshold.includes("60"))
          threshSelect.value = "1 hour";
      }

      const isCustom =
        schedText.includes("Active") &&
        !schedText.includes("24/7") &&
        !schedText.includes("24x7");
      const hoursRadio24 = document.querySelector(
        'input[name="monitoringHoursRadio"][value="24x7"]',
      );
      const hoursRadioCustom = document.querySelector(
        'input[name="monitoringHoursRadio"][value="custom"]',
      );

      if (isCustom) {
        if (hoursRadioCustom) hoursRadioCustom.checked = true;
        if (customHoursContainer) customHoursContainer.style.display = "flex";
        // parse active hours: e.g. "Active 22:00–06:00"
        const activeHoursPart = schedText.split("Active")[1]?.trim() || "";
        const times = activeHoursPart.split(/[–-]/).map((t) => t.trim());
        if (times[0] && times[1]) {
          const fromInput = document.getElementById("monitoringFromInput");
          if (fromInput) fromInput.value = times[0];
          const toInput = document.getElementById("monitoringToInput");
          if (toInput) toInput.value = times[1];
        }
      } else {
        if (hoursRadio24) hoursRadio24.checked = true;
        if (customHoursContainer) customHoursContainer.style.display = "none";
      }
    }

    // Recipients
    const recipText = card.querySelector(".recipients-val")?.textContent || "";
    // If it's the custom format: "Main User, raju@wilyer.com, Store Manager"
    // or the hardcoded format: "1 Main User • 2 Sub Users • 1 Role"
    const chkMain = document.getElementById("chkMainAccountHolder");
    if (chkMain) {
      chkMain.checked =
        recipText.toLowerCase().includes("main user") ||
        recipText.toLowerCase().includes("admin");
    }

    // Populate sub-users and roles based on parsed text
    if (subUsersTagContainer) {
      subUsersTagContainer
        .querySelectorAll(".user-tag-chip")
        .forEach((c) => c.remove());
    }
    if (rolesTagContainer) {
      rolesTagContainer
        .querySelectorAll(".role-tag-chip")
        .forEach((c) => c.remove());
    }

    const items = recipText.split(/[•,]/).map((i) => i.trim());
    items.forEach((item) => {
      if (item.includes("@")) {
        // Sub User email
        const chip = createRichUserChip(item);
        subUsersTagContainer.insertBefore(chip, subUserSearchInput);
      } else if (
        item &&
        !item.toLowerCase().includes("main user") &&
        !item.toLowerCase().includes("admin") &&
        !item.match(/^[0-9]+ /)
      ) {
        // Role
        const chip = document.createElement("span");
        chip.className = "user-tag-chip role-tag-chip";
        chip.innerHTML = `🛡️ ${item} <button type="button" class="tag-close-btn remove-role-tag">&times;</button>`;
        rolesTagContainer.insertBefore(chip, roleSearchInput);
      }
    });

    // If it was the old hardcoded formats (like "2 Sub Users • 1 Role"):
    const subUserCount = recipText.match(/([0-9]+) Sub User/);
    const roleCount = recipText.match(/([0-9]+) Role/);

    if (
      subUserCount &&
      subUsersTagContainer.querySelectorAll(".user-tag-chip").length === 0
    ) {
      const num = parseInt(subUserCount[1]);
      const defaults = ["raju@wilyer.com", "simran@wilyer.com"];
      for (let i = 0; i < Math.min(num, defaults.length); i++) {
        const chip = createRichUserChip(defaults[i]);
        subUsersTagContainer.insertBefore(chip, subUserSearchInput);
      }
    }
    if (
      roleCount &&
      rolesTagContainer.querySelectorAll(".role-tag-chip").length === 0
    ) {
      const num = parseInt(roleCount[1]);
      const defaults = ["Store Manager", "Territory Lead"];
      for (let i = 0; i < Math.min(num, defaults.length); i++) {
        const chip = document.createElement("span");
        chip.className = "user-tag-chip role-tag-chip";
        chip.innerHTML = `🛡️ ${defaults[i]} <button type="button" class="tag-close-btn remove-role-tag">&times;</button>`;
        rolesTagContainer.insertBefore(chip, roleSearchInput);
      }
    }

    updateTagCounts();
    updateSchedulingUI();
  }

  // Notification Form Status Toggle
  const notifFormStatusToggle = document.getElementById(
    "notifFormStatusToggle",
  );

  if (notifFormStatusToggle) {
    notifFormStatusToggle.addEventListener("change", () => {
      const isReport = typeCardReport
        ? typeCardReport.classList.contains("selected")
        : true;
      if (isReport) {
        reportStatusEnabled = notifFormStatusToggle.checked;
      } else {
        alertStatusEnabled = notifFormStatusToggle.checked;
      }
    });
  }

  // Target Screen Scope Split Buttons (Online vs Offline)
  const btnScopeOnline = document.getElementById("btnScopeOnline");
  const btnScopeOffline = document.getElementById("btnScopeOffline");

  // Frequency Tab Switching (Daily, Weekly, Monthly)
  const tabFreqDaily = document.getElementById("tabFreqDaily");
  const tabFreqWeekly = document.getElementById("tabFreqWeekly");
  const tabFreqMonthly = document.getElementById("tabFreqMonthly");

  // WEEKLY OFFLINE SCHEDULING SYSTEM
  const weeklyDayChips = document.getElementById("weeklyDayChips");
  const weeklyCardsContainer = document.getElementById("weeklyCardsContainer");

  const dayFullNames = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Map: dayKey -> { enabled: boolean, times: string[] }
  const weeklyDayData = new Map();

  function renderWeeklyScheduleUI() {
    if (!weeklyDayChips) return;

    // 1. Synchronize Day Chip active states
    const chipBtns = weeklyDayChips.querySelectorAll(".day-chip");
    chipBtns.forEach((btn) => {
      const dayKey = btn.getAttribute("data-day");
      if (weeklyDayData.has(dayKey)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // 2. Render Weekday Schedule Cards in Order
    if (!weeklyCardsContainer) return;
    weeklyCardsContainer.innerHTML = "";

    let hasSelected = false;
    dayOrder.forEach((dayKey) => {
      if (weeklyDayData.has(dayKey)) {
        hasSelected = true;
        const data = weeklyDayData.get(dayKey);
        const fullName = dayFullNames[dayKey] || dayKey;

        const card = document.createElement("div");
        card.className = "schedule-card section-card";
        card.style.cssText = "padding:20px;";
        card.setAttribute("data-day-card", dayKey);

        card.innerHTML = `
                    <div class="schedule-card-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid rgba(20,83,182,0.1);">
                      <span class="schedule-card-title" style="font-size:15px;font-weight:700;color:#092755;display:flex;align-items:center;gap:8px;"><i class="ph ph-calendar-check" style="color:#1A6FF3;font-size:16px"></i> ${fullName} Schedule</span>
                      <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:12px;color:#6E6F71;font-weight:600;">${data.enabled ? "Enabled" : "Disabled"}</span>
                        <label class="toggle-switch">
                          <input type="checkbox" class="day-enable-toggle" data-day="${dayKey}" ${data.enabled ? "checked" : ""}>
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                    
                    <div class="day-schedule-body" style="${data.enabled ? "" : "opacity:0.5;pointer-events:none;"}">
                      <div class="time-picker-list" style="display:flex;flex-direction:column;gap:10px;margin-bottom:12px;">
                        ${data.times
                          .map(
                            (tVal, tIdx) => `
                          <div class="time-picker-row" style="background:#F8FAFC;padding:10px 14px;border-radius:8px;border:1px solid rgba(20,83,182,0.15);display:flex;align-items:center;justify-content:space-between;">
                            <div style="display:flex;align-items:center;gap:10px;">
                              <i class="ph ph-clock" style="color:#1A6FF3;font-size:16px"></i>
                              <input type="time" value="${tVal}" class="weekly-time-input" data-day="${dayKey}" data-tidx="${tIdx}" style="height:36px;border-radius:6px;padding:0 10px;border:1px solid rgba(20,83,182,0.3);font-size:13.5px;font-weight:600;">
                            </div>
                            <button type="button" class="tag-close-btn remove-weekly-time-btn" data-day="${dayKey}" data-tidx="${tIdx}" title="Remove time"><i class="ph ph-trash-simple"></i></button>
                          </div>
                        `,
                          )
                          .join("")}
                      </div>
                      <button type="button" class="btn btn-tertiary btn-sm add-weekly-time-btn" data-day="${dayKey}" style="border-style:dashed;">+ Add Time</button>
                    </div>
                `;
        weeklyCardsContainer.appendChild(card);
      }
    });

    if (!hasSelected) {
      weeklyCardsContainer.innerHTML = `
                <div style="padding:16px;background:#F8FAFC;border:1px dashed rgba(20,83,182,0.2);border-radius:8px;font-size:13px;color:#6E6F71;text-align:center;">
                  No weekdays selected. Select one or more days above to configure weekly schedules.
                </div>
            `;
    }
  }

  // Day chip click handler: select / deselect weekday
  if (weeklyDayChips) {
    weeklyDayChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".day-chip");
      if (!chip) return;
      const dayKey = chip.getAttribute("data-day");
      if (!dayKey) return;

      if (weeklyDayData.has(dayKey)) {
        weeklyDayData.delete(dayKey);
      } else {
        weeklyDayData.set(dayKey, { enabled: true, times: ["09:00"] });
      }
      renderWeeklyScheduleUI();
    });
  }

  // Weekly time input change handler
  document.addEventListener("change", (e) => {
    if (e.target && e.target.classList.contains("weekly-time-input")) {
      const dayKey = e.target.getAttribute("data-day");
      const tIdx = parseInt(e.target.getAttribute("data-tidx"));
      if (weeklyDayData.has(dayKey) && !isNaN(tIdx)) {
        const data = weeklyDayData.get(dayKey);
        if (data.times[tIdx] !== undefined) {
          data.times[tIdx] = e.target.value;
        }
      }
    }
  });

  // Toggle day enable/disable
  document.addEventListener("change", (e) => {
    if (e.target && e.target.classList.contains("day-enable-toggle")) {
      const dayKey = e.target.getAttribute("data-day");
      if (weeklyDayData.has(dayKey)) {
        const data = weeklyDayData.get(dayKey);
        data.enabled = e.target.checked;
        renderWeeklyScheduleUI();
      }
    }
  });

  // Add Time to weekday schedule card
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-weekly-time-btn");
    if (addBtn) {
      const dayKey = addBtn.getAttribute("data-day");
      if (weeklyDayData.has(dayKey)) {
        const data = weeklyDayData.get(dayKey);
        data.times.push("18:00");
        renderWeeklyScheduleUI();
      }
    }
  });

  // Remove Time from weekday schedule card
  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-weekly-time-btn");
    if (removeBtn) {
      const dayKey = removeBtn.getAttribute("data-day");
      const tIdx = parseInt(removeBtn.getAttribute("data-tidx"));
      if (weeklyDayData.has(dayKey) && !isNaN(tIdx)) {
        const data = weeklyDayData.get(dayKey);
        data.times.splice(tIdx, 1);
        renderWeeklyScheduleUI();
      }
    }
  });

  function updateSchedulingUI() {
    const isOnline = btnScopeOnline
      ? btnScopeOnline.classList.contains("active")
      : true;

    let currentFreq = "daily";
    if (tabFreqWeekly && tabFreqWeekly.classList.contains("active"))
      currentFreq = "weekly";
    else if (tabFreqMonthly && tabFreqMonthly.classList.contains("active"))
      currentFreq = "monthly";

    if (currentFreq === "daily") {
      if (dailyConfigContainer) dailyConfigContainer.style.display = "block";
      if (weeklyConfigContainer) weeklyConfigContainer.style.display = "none";
      if (monthlyConfigContainer) monthlyConfigContainer.style.display = "none";
    } else if (currentFreq === "weekly") {
      if (dailyConfigContainer) dailyConfigContainer.style.display = "none";
      if (weeklyConfigContainer) weeklyConfigContainer.style.display = "block";
      if (monthlyConfigContainer) monthlyConfigContainer.style.display = "none";
      renderWeeklyScheduleUI();
    } else if (currentFreq === "monthly") {
      if (dailyConfigContainer) dailyConfigContainer.style.display = "none";
      if (weeklyConfigContainer) weeklyConfigContainer.style.display = "none";
      if (monthlyConfigContainer) monthlyConfigContainer.style.display = "flex";
      renderMonthlyDatesGrid();
    }
  }

  [btnScopeOnline, btnScopeOffline].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        btnScopeOnline.classList.remove("active");
        btnScopeOffline.classList.remove("active");
        btn.classList.add("active");
        updateSchedulingUI();
      });
    }
  });

  function selectFreqTab(freq) {
    [tabFreqDaily, tabFreqWeekly, tabFreqMonthly].forEach((t) => {
      if (t) t.classList.remove("active");
    });

    if (freq === "daily" && tabFreqDaily) tabFreqDaily.classList.add("active");
    else if (freq === "weekly" && tabFreqWeekly)
      tabFreqWeekly.classList.add("active");
    else if (freq === "monthly" && tabFreqMonthly)
      tabFreqMonthly.classList.add("active");

    updateSchedulingUI();
  }

  if (tabFreqDaily)
    tabFreqDaily.addEventListener("click", () => selectFreqTab("daily"));
  if (tabFreqWeekly)
    tabFreqWeekly.addEventListener("click", () => selectFreqTab("weekly"));
  if (tabFreqMonthly)
    tabFreqMonthly.addEventListener("click", () => selectFreqTab("monthly"));

  // Daily Schedule Time stackable list logic (Add/Remove)
  const dailyTimeList = document.getElementById("dailyTimeList");
  const addDailyTimeBtn = document.getElementById("addDailyTimeBtn");
  const dailyTimesBadge = document.getElementById("dailyTimesBadge");

  function updateDailyTimesBadge() {
    if (dailyTimeList && dailyTimesBadge) {
      const count = dailyTimeList.querySelectorAll(".time-picker-row").length;
      dailyTimesBadge.textContent = `${count} Time${count === 1 ? "" : "s"} Daily`;
    }
  }

  if (addDailyTimeBtn && dailyTimeList) {
    addDailyTimeBtn.addEventListener("click", () => {
      const newRow = document.createElement("div");
      newRow.className = "time-picker-row";
      newRow.style.cssText = "background:#F8FAFC;padding:12px 16px;border-radius:10px;border:1px solid rgba(20,83,182,0.15);justify-content:space-between;";
      newRow.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;">
          <i class="ph ph-clock" style="color:#1A6FF3;font-size:16px"></i>
          <input type="time" value="12:00" class="daily-time-input" style="height:38px;border-radius:8px;padding:0 12px;border:1px solid rgba(20,83,182,0.3);font-size:14px;font-weight:600;">
        </div>
        <button type="button" class="tag-close-btn remove-time-btn" title="Remove time" style="font-size:18px;"><i class="ph ph-trash-simple"></i></button>
      `;
      dailyTimeList.appendChild(newRow);
      updateDailyTimesBadge();
    });
  }

  if (dailyTimeList) {
    dailyTimeList.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".remove-time-btn");
      if (removeBtn) {
        const row = removeBtn.closest(".time-picker-row");
        if (row) {
          row.remove();
          updateDailyTimesBadge();
        }
      }
    });
  }

  // MONTHLY SCHEDULING SYSTEM (REFINED UX)
  const monthlyDatesGrid = document.getElementById("monthlyDatesGrid");
  const dateOccurPillRow = document.getElementById("dateOccurPillRow");
  const monthlyCustomCardsContainer = document.getElementById(
    "monthlyCustomCardsContainer",
  );
  const btnToggleCustomList = document.getElementById("btnToggleCustomList");
  const monthlyDefaultCard = document.getElementById("monthlyDefaultCard");

  // 1. Start with NO pre-selected dates
  const selectedMonthlyDates = new Set();
  const customizedMonthlyDates = new Map();

  function renderMonthlyDatesGrid() {
    if (!monthlyDatesGrid) return;
    monthlyDatesGrid.innerHTML = "";

    for (let i = 1; i <= 31; i++) {
      const pill = document.createElement("div");
      const isSel = selectedMonthlyDates.has(i);

      pill.className = `monthly-date-pill ${isSel ? "selected" : ""}`;
      pill.innerHTML = `<span>${i}</span>`;
      pill.addEventListener("click", () => toggleMonthlyDate(i));
      monthlyDatesGrid.appendChild(pill);
    }

    renderDateOccurrencePills();
  }

  function toggleMonthlyDate(dateVal) {
    if (selectedMonthlyDates.has(dateVal)) {
      selectedMonthlyDates.delete(dateVal);
      customizedMonthlyDates.delete(dateVal);
    } else {
      selectedMonthlyDates.add(dateVal);
      if (!customizedMonthlyDates.has(dateVal)) {
        customizedMonthlyDates.set(dateVal, {
          enabled: true,
          times: ["09:00 AM", "06:00 PM"],
        });
      }
    }
    renderMonthlyDatesGrid();
  }

  function renderDateOccurrencePills() {
    if (!dateOccurPillRow) return;
    dateOccurPillRow.innerHTML = "";

    if (selectedMonthlyDates.size === 0) {
      dateOccurPillRow.innerHTML = `
                <div style="padding:14px;background:#F8FAFC;border:1px dashed rgba(20,83,182,0.2);border-radius:8px;font-size:13px;color:#6E6F71;text-align:center;">
                  No dates selected. Select one or more dates from the grid above to configure time schedules.
                </div>
            `;
      return;
    }

    selectedMonthlyDates.forEach((dateVal) => {
      if (!customizedMonthlyDates.has(dateVal)) {
        customizedMonthlyDates.set(dateVal, {
          enabled: true,
          times: ["09:00 AM", "06:00 PM"],
        });
      }
      const customTimes = customizedMonthlyDates.get(dateVal).times;

      const itemRow = document.createElement("div");
      itemRow.className = "date-occur-item-row";
      itemRow.style.cssText =
        "background:#F8FAFC;padding:16px;border-radius:8px;border:1px solid rgba(20,83,182,0.15);margin-bottom:12px;";
      itemRow.innerHTML = `
                <div class="date-occur-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <i class="ph ph-calendar" style="color:#1A6FF3;font-size:16px"></i>
                    <span class="custom-date-tag">Date ${dateVal} Schedule</span>
                  </div>
                </div>

                <div class="time-picker-list" style="gap:10px;margin-bottom:12px;">
                  ${customTimes
                    .map(
                      (t, idx) => `
                  <div class="time-picker-row" style="background:#FFFFFF;padding:10px 14px;border-radius:8px;border:1px solid rgba(20,83,182,0.15);display:flex;align-items:center;justify-content:space-between;">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <i class="ph ph-clock" style="color:#1A6FF3;font-size:16px"></i>
                      <input type="time" value="${t.includes("11") ? "11:00" : "09:00"}" class="custom-time-input" data-date="${dateVal}" data-idx="${idx}" style="height:36px;border-radius:6px;padding:0 10px;border:1px solid rgba(20,83,182,0.3);font-size:13.5px;font-weight:600;">
                    </div>
                    <button type="button" class="tag-close-btn remove-custom-time-btn" data-date="${dateVal}" data-idx="${idx}"><i class="ph ph-trash-simple"></i></button>
                  </div>
                  `,
                    )
                    .join("")}
                </div>
                <button type="button" class="btn btn-tertiary btn-sm add-custom-time-btn" data-date="${dateVal}" style="border-style:dashed;">+ Add Time</button>
            `;

      dateOccurPillRow.appendChild(itemRow);
    });
  }

  // Add Custom Time for Monthly Selected Date
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-custom-time-btn");
    if (addBtn) {
      const rawVal = addBtn.getAttribute("data-date");
      const dateVal = parseInt(rawVal);
      if (customizedMonthlyDates.has(dateVal)) {
        customizedMonthlyDates.get(dateVal).times.push("12:00 PM");
        renderMonthlyDatesGrid();
      }
    }
  });

  // Remove Custom Time
  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".remove-custom-time-btn");
    if (removeBtn) {
      const rawVal = removeBtn.getAttribute("data-date");
      const dateVal = rawVal === "Last Day" ? "Last Day" : parseInt(rawVal);
      const idx = parseInt(removeBtn.getAttribute("data-idx"));

      if (customizedMonthlyDates.has(dateVal)) {
        const times = customizedMonthlyDates.get(dateVal).times;
        times.splice(idx, 1);
        renderMonthlyDatesGrid();
      }
    }
  });

  // Tag Chips Add/Remove for Sub Users & Roles (Screenshot 2)
  const subUsersTagContainer = document.getElementById("subUsersTagContainer");
  const rolesTagContainer = document.getElementById("rolesTagContainer");
  const subUserSearchInput = document.getElementById("subUserSearchInput");
  const roleSearchInput = document.getElementById("roleSearchInput");
  const subUserCountLabel = document.getElementById("subUserCountLabel");
  const roleCountLabel = document.getElementById("roleCountLabel");

  function updateTagCounts() {
    if (subUsersTagContainer && subUserCountLabel) {
      const count =
        subUsersTagContainer.querySelectorAll(".user-tag-chip").length;
      subUserCountLabel.textContent = `${count} selected`;
    }
    if (rolesTagContainer && roleCountLabel) {
      const count = rolesTagContainer.querySelectorAll(".role-tag-chip").length;
      roleCountLabel.textContent = `${count} selected`;
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("remove-user-tag")) {
      e.target.closest(".user-tag-chip").remove();
      updateTagCounts();
    }
    if (e.target && e.target.classList.contains("remove-role-tag")) {
      e.target.closest(".role-tag-chip").remove();
      updateTagCounts();
    }
  });

  let userSearchDropdown = null;
  let currentDropdownTarget = null;

  function createUserDropdown() {
    userSearchDropdown = document.createElement("div");
    userSearchDropdown.className = "user-search-dropdown";
    userSearchDropdown.style.position = "absolute";
    userSearchDropdown.style.display = "none";
    userSearchDropdown.style.boxSizing = "border-box";
    document.body.appendChild(userSearchDropdown);

    window.addEventListener(
      "scroll",
      () => {
        if (
          userSearchDropdown?.style.display === "block" &&
          currentDropdownTarget
        ) {
          positionDropdownBelowInput(currentDropdownTarget);
        }
      },
      true,
    );

    window.addEventListener("resize", () => {
      if (
        userSearchDropdown?.style.display === "block" &&
        currentDropdownTarget
      ) {
        positionDropdownBelowInput(currentDropdownTarget);
      }
    });
  }

  function positionDropdownBelowInput(inputEl) {
    if (!userSearchDropdown) return;
    const rect = inputEl.getBoundingClientRect();
    const targetWidth = Math.min(Math.max(rect.width, 240), 420);
    let leftPos = rect.left + window.scrollX;
    const viewportRight = window.scrollX + window.innerWidth - 12;
    const overflow = leftPos + targetWidth - viewportRight;
    if (overflow > 0) {
      leftPos -= overflow;
    }
    if (leftPos < window.scrollX + 12) {
      leftPos = window.scrollX + 12;
    }
    userSearchDropdown.style.width = `${targetWidth}px`;
    userSearchDropdown.style.left = `${leftPos}px`;
    userSearchDropdown.style.right = "";
    userSearchDropdown.style.top = `${rect.bottom + window.scrollY + 6}px`;
  }

  function showUserDropdown(query = "", targetInput = null) {
    if (!userSearchDropdown) {
      createUserDropdown();
    }
    if (!targetInput) return;

    currentDropdownTarget = targetInput;
    positionDropdownBelowInput(targetInput);

    const isRoleSearch = targetInput.id === "roleSearchInput";
    const q = query.toLowerCase();
    const filtered = isRoleSearch
      ? mockRoles.filter((role) => role.label.toLowerCase().includes(q))
      : mockUsers.filter((user) => {
          return (
            user.name.toLowerCase().includes(q) ||
            user.email.toLowerCase().includes(q) ||
            user.location.toLowerCase().includes(q)
          );
        });

    if (filtered.length === 0) {
      userSearchDropdown.innerHTML =
        '<div style="padding:10px 14px;font-size:12.5px;color:#6E6F71;">No matching items found</div>';
      userSearchDropdown.style.display = "block";
      return;
    }

    userSearchDropdown.innerHTML = "";
    filtered.forEach((itemData) => {
      const item = document.createElement("div");
      item.className = "user-search-item";
      if (isRoleSearch) {
        item.innerHTML = `
                    <div class="user-avatar-circle">🛡️</div>
                    <div class="user-search-info">
                        <span class="user-search-name">${itemData.label}</span>
                        <span class="user-search-sub">Role suggestion</span>
                    </div>
                `;
      } else {
        const initial = itemData.name.charAt(0).toUpperCase();
        item.innerHTML = `
                    <div class="user-avatar-circle">
                        ${itemData.photo ? `<img src="${itemData.photo}" alt="${itemData.name}" />` : initial}
                    </div>
                    <div class="user-search-info">
                        <span class="user-search-name">${itemData.name}</span>
                        <span class="user-search-sub">${itemData.email} • ${itemData.location}</span>
                    </div>
                `;
      }

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const selectedContainer =
          targetInput.id === "subUserSearchInput"
            ? subUsersTagContainer
            : rolesTagContainer;
        if (isRoleSearch) {
          const alreadyAdded = Array.from(
            selectedContainer.querySelectorAll(".role-tag-chip"),
          ).some((chip) => chip.textContent.trim().startsWith(itemData.label));
          if (!alreadyAdded) {
            const chip = document.createElement("span");
            chip.className = "user-tag-chip role-tag-chip";
            chip.innerHTML = `🛡️ ${itemData.label} <button type="button" class="tag-close-btn remove-role-tag">&times;</button>`;
            selectedContainer.insertBefore(chip, targetInput);
            updateTagCounts();
          }
        } else {
          const alreadyAdded = Array.from(
            selectedContainer.querySelectorAll(".user-tag-chip"),
          ).some((chip) => chip.getAttribute("data-user") === itemData.email);
          if (!alreadyAdded) {
            const chip = createRichUserChip(itemData.email);
            selectedContainer.insertBefore(chip, targetInput);
            updateTagCounts();
          }
        }

        targetInput.value = "";
        hideUserDropdown();
      });

      userSearchDropdown.appendChild(item);
    });

    userSearchDropdown.style.display = "block";
  }

  function hideUserDropdown() {
    if (userSearchDropdown) {
      userSearchDropdown.style.display = "none";
      currentDropdownTarget = null;
    }
  }

  if (subUserSearchInput) {
    subUserSearchInput.addEventListener("focus", () => {
      showUserDropdown(subUserSearchInput.value, subUserSearchInput);
    });

    subUserSearchInput.addEventListener("input", () => {
      showUserDropdown(subUserSearchInput.value, subUserSearchInput);
    });

    subUserSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const text = subUserSearchInput.value.trim();
        if (text) {
          const alreadyAdded = Array.from(
            subUsersTagContainer.querySelectorAll(".user-tag-chip"),
          ).some((chip) => chip.getAttribute("data-user") === text);

          if (!alreadyAdded) {
            const chip = createRichUserChip(text);
            subUsersTagContainer.insertBefore(chip, subUserSearchInput);
            updateTagCounts();
          }
          subUserSearchInput.value = "";
          hideUserDropdown();
        }
      }
    });
  }

  if (roleSearchInput) {
    roleSearchInput.addEventListener("focus", () => {
      showUserDropdown(roleSearchInput.value, roleSearchInput);
    });

    roleSearchInput.addEventListener("input", () => {
      showUserDropdown(roleSearchInput.value, roleSearchInput);
    });

    roleSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && roleSearchInput.value.trim()) {
        e.preventDefault();
        const role = roleSearchInput.value.trim();
        const chip = document.createElement("span");
        chip.className = "user-tag-chip role-tag-chip";
        chip.innerHTML = `🛡️ ${role} <button type="button" class="tag-close-btn remove-role-tag">&times;</button>`;
        rolesTagContainer.insertBefore(chip, roleSearchInput);
        roleSearchInput.value = "";
        updateTagCounts();
        hideUserDropdown();
      }
    });
  }

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target instanceof Element &&
      target !== subUserSearchInput &&
      target !== roleSearchInput &&
      !userSearchDropdown?.contains(target) &&
      !subUsersTagContainer.contains(target) &&
      !rolesTagContainer.contains(target)
    ) {
      hideUserDropdown();
    }
  });

  // ==========================================================================
  // 13. SOS MODE MODULE INTERACTION ENGINE (4-STEP WIZARD)
  // ==========================================================================
  const sosState = {
    currentStep: 1,
    maxUnlockedStep: 1,
    isActivated: false,
    triggers: [
      {
        id: "trig-1",
        name: "Building A Main Fire Alarm",
        type: "Fire Alarm System",
        desc: "Primary fire alarm panel situated on Ground Floor lobby area.",
        status: "Connected",
      },
      {
        id: "trig-2",
        name: "West Wing Smoke Sensor",
        type: "Smoke Sensor",
        desc: "Optical smoke detector located in 2nd Floor server corridor.",
        status: "Connected",
      },
    ],
    mappings: new Map([
      [
        "trig-1",
        {
          layout: "Fire Evacuation Layout (Fire Hazard)",
          enabled: true,
          zones: ["zone-1", "zone-2"],
        },
      ],
      [
        "trig-2",
        {
          layout: "Smoke Warning Layout (Air Quality Alert)",
          enabled: true,
          zones: ["zone-6"],
        },
      ],
    ]),
    availableLayouts: [
      "Fire Evacuation Layout (Fire Hazard)",
      "Smoke Warning Layout (Air Quality Alert)",
      "Gas Leak Evacuation Layout (Hazardous Gas)",
      "Emergency Broadcast Layout (General Warning)",
      "Remote SOS Alert Layout (Security Evacuation)",
    ],
    zones: [
      {
        id: "zone-1",
        name: "Reception",
        group: "Reception Displays",
        screens: 12,
        selected: true,
      },
      {
        id: "zone-2",
        name: "Lobby",
        group: "Lobby Video Wall & Pillars",
        screens: 24,
        selected: true,
      },
      {
        id: "zone-3",
        name: "Floor 1",
        group: "Floor 1 Corridors & Bays",
        screens: 18,
        selected: false,
      },
      {
        id: "zone-4",
        name: "Floor 2",
        group: "Floor 2 Office Wings",
        screens: 20,
        selected: false,
      },
      {
        id: "zone-5",
        name: "Parking",
        group: "Subterranean Parking Displays",
        screens: 15,
        selected: false,
      },
      {
        id: "zone-6",
        name: "Cafeteria",
        group: "Dining & Breakroom Monitors",
        screens: 10,
        selected: true,
      },
      {
        id: "zone-7",
        name: "Conference Area",
        group: "Executive Meeting Rooms",
        screens: 16,
        selected: false,
      },
      {
        id: "zone-8",
        name: "Basement",
        group: "Service & Maintenance Bays",
        screens: 8,
        selected: false,
      },
    ],
  };

  // DOM Elements
  const sosNextBtn1 = document.getElementById("sosNextBtn1");
  const sosNextBtn2 = document.getElementById("sosNextBtn2");
  const sosNextBtn3 = document.getElementById("sosNextBtn3");
  const sosPrevBtn2 = document.getElementById("sosPrevBtn2");
  const sosPrevBtn3 = document.getElementById("sosPrevBtn3");
  const sosPrevBtn4 = document.getElementById("sosPrevBtn4");

  const openAddTriggerModalBtn = document.getElementById(
    "openAddTriggerModalBtn",
  );
  const addTriggerModal = document.getElementById("addTriggerModal");
  const closeTriggerModalBtn = document.getElementById("closeTriggerModalBtn");
  const cancelTriggerModalBtn = document.getElementById(
    "cancelTriggerModalBtn",
  );
  const saveTriggerBtn = document.getElementById("saveTriggerBtn");
  const triggerModalTitle = document.getElementById("triggerModalTitle");
  const editingTriggerIdInput = document.getElementById("editingTriggerId");
  const triggerNameInput = document.getElementById("triggerNameInput");
  const triggerTypeSelect = document.getElementById("triggerTypeSelect");
  const triggerDescInput = document.getElementById("triggerDescInput");
  const triggerStatusSelect = document.getElementById("triggerStatusSelect");

  const sosTriggersGrid = document.getElementById("sosTriggersGrid");
  const sosMappingsList = document.getElementById("sosMappingsList");
  const sosStep2MappedBadge = document.getElementById("sosStep2MappedBadge");
  const sosStep3MappingsSummaryRow = document.getElementById(
    "sosStep3MappingsSummaryRow",
  );
  const sosZonesGrid = document.getElementById("sosZonesGrid");

  const sosSelectAllZonesBtn = document.getElementById("sosSelectAllZonesBtn");
  const sosDeselectAllZonesBtn = document.getElementById(
    "sosDeselectAllZonesBtn",
  );

  const sosSummaryZoneCount = document.getElementById("sosSummaryZoneCount");
  const sosSummaryGroupCount = document.getElementById("sosSummaryGroupCount");
  const sosSummaryScreenCount = document.getElementById(
    "sosSummaryScreenCount",
  );
  const sosSummaryZonesList = document.getElementById("sosSummaryZonesList");

  const activateSOSWorkflowBtn = document.getElementById(
    "activateSOSWorkflowBtn",
  );
  const sosHeaderActivateBtn = document.getElementById("sosHeaderActivateBtn");
  const sosGlobalStatusBadge = document.getElementById("sosGlobalStatusBadge");
  const sosActivationSuccessBanner = document.getElementById(
    "sosActivationSuccessBanner",
  );
  const sosDryRunBtn = document.getElementById("sosDryRunBtn");

  // Standardized Device Trigger Icon System with Exact Semantic Icons
  function getTriggerIconHTML(type) {
    const lowerType = (type || "").toLowerCase();

    let iconClass = "ph-bell";
    let bgColor = "#EFF3FF";
    let strokeColor = "#1A6FF3";

    if (lowerType.includes("fire")) {
      iconClass = "ph-flame";
      bgColor = "#FEF2F2";
      strokeColor = "#EF4444";
    } else if (lowerType.includes("smoke")) {
      iconClass = "ph-wind";
      bgColor = "#F1F5F9";
      strokeColor = "#475569";
    } else if (lowerType.includes("gas")) {
      iconClass = "ph-wind";
      bgColor = "#FFFBEB";
      strokeColor = "#D97706";
    } else if (
      lowerType.includes("manual") ||
      lowerType.includes("panic") ||
      lowerType.includes("sos")
    ) {
      iconClass = "ph-warning-circle";
      bgColor = "#FEF2F2";
      strokeColor = "#EF4444";
    } else if (lowerType.includes("whatsapp")) {
      iconClass = "ph-chat-circle-dots";
      bgColor = "#ECFDF5";
      strokeColor = "#10B981";
    } else if (lowerType.includes("web")) {
      iconClass = "ph-globe";
      bgColor = "#EFF3FF";
      strokeColor = "#1A6FF3";
    }

    return `
            <div style="width:40px;height:40px;border-radius:8px;background:${bgColor};color:${strokeColor};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="ph ${iconClass}" style="font-size: 20px;"></i>
            </div>
        `;
  }

  // Calculate Step Completion & Max Unlocked Step
  function calculateSOSValidation() {
    const step1Valid = sosState.triggers.length > 0;

    let step2Valid = false;
    if (step1Valid) {
      step2Valid = sosState.triggers.some((trig) => {
        const mapObj = sosState.mappings.get(trig.id);
        return (
          mapObj &&
          mapObj.enabled === true &&
          mapObj.layout &&
          mapObj.zones &&
          mapObj.zones.length > 0
        );
      });
    }

    let step3Valid = step2Valid; // Step 3 is read-only review

    let maxUnlocked = 1;
    if (step1Valid) maxUnlocked = 2;
    if (step1Valid && step2Valid) maxUnlocked = 3;
    if (step1Valid && step2Valid && step3Valid) maxUnlocked = 4;

    sosState.maxUnlockedStep = maxUnlocked;

    return { step1Valid, step2Valid, step3Valid, maxUnlocked };
  }

  function updateSOSStepperUI() {
    const { step1Valid, step2Valid, step3Valid, maxUnlocked } =
      calculateSOSValidation();

    // Update Stepper Header Nav Cards
    [1, 2, 3, 4].forEach((stepNum) => {
      const nav = document.getElementById(`sosStepNav${stepNum}`);
      const numBox = document.getElementById(`sosStepNum${stepNum}`);
      const tag = document.getElementById(`sosStepTag${stepNum}`);
      if (!nav || !numBox || !tag) return;

      nav.classList.remove("active", "completed", "locked");

      if (stepNum === sosState.currentStep) {
        nav.classList.add("active");
        nav.setAttribute("aria-current", "step");
        nav.setAttribute("aria-label", `Step ${stepNum} active`);
        numBox.textContent = `${stepNum}`;
        tag.textContent = "";
      } else if (stepNum < sosState.currentStep) {
        nav.classList.add("completed");
        nav.removeAttribute("aria-current");
        nav.setAttribute("aria-label", `Step ${stepNum} completed`);
        numBox.innerHTML =
          '<i class="ph ph-check" style="font-size:12px;"></i>';
        tag.textContent = "DONE";
      } else {
        nav.removeAttribute("aria-current");
        nav.setAttribute("aria-label", `Step ${stepNum} locked`);
        numBox.textContent = `${stepNum}`;
        tag.textContent = "";
      }
    });

    // Update Continuation Buttons state
    if (sosNextBtn1) {
      sosNextBtn1.disabled = !step1Valid;
      sosNextBtn1.className = "btn btn-secondary";
    }
    if (sosNextBtn2) {
      // Do not disable next button in step 2; we will validate and show Wilyer Error Component on click
      sosNextBtn2.disabled = false;
      sosNextBtn2.className = "btn btn-secondary";
    }
    if (sosNextBtn3) {
      sosNextBtn3.disabled = !step3Valid;
      sosNextBtn3.className = "btn btn-secondary";
    }
  }

  function goToSOSStep(targetStep) {
    const validation = calculateSOSValidation();

    // Validation check for moving from Step 2 to Step 3
    if (sosState.currentStep === 2 && targetStep > 2) {
      if (!validation.step2Valid) {
        showToast(
          "Configure at least one trigger mapping before continuing.",
          "error",
        );
        return;
      }
    }

    if (targetStep > sosState.maxUnlockedStep) {
      showToast(
        `Please complete Step ${sosState.maxUnlockedStep} before proceeding.`,
        "error",
      );
      return;
    }

    sosState.currentStep = targetStep;

    [1, 2, 3, 4].forEach((stepNum) => {
      const pane = document.getElementById(`sosStepPane${stepNum}`);
      if (pane) {
        if (stepNum === targetStep) {
          pane.style.display = "block";
          pane.classList.add("active");
        } else {
          pane.style.display = "none";
          pane.classList.remove("active");
        }
      }
    });

    updateSOSStepperUI();

    // Render target step contents
    if (targetStep === 1) renderSOSTriggersGrid();
    else if (targetStep === 2) renderSOSMappingsList();
    else if (targetStep === 3) renderSOSStep3Review();
    else if (targetStep === 4) renderSOSReviewPage();
  }

  // Next & Previous Buttons
  if (sosNextBtn1) sosNextBtn1.addEventListener("click", () => goToSOSStep(2));
  if (sosNextBtn2) sosNextBtn2.addEventListener("click", () => goToSOSStep(3));
  if (sosNextBtn3) sosNextBtn3.addEventListener("click", () => goToSOSStep(4));

  if (sosPrevBtn2) sosPrevBtn2.addEventListener("click", () => goToSOSStep(1));
  if (sosPrevBtn3) sosPrevBtn3.addEventListener("click", () => goToSOSStep(2));
  if (sosPrevBtn4) sosPrevBtn4.addEventListener("click", () => goToSOSStep(3));

  // RENDER STEP 1: TRIGGER SOURCES GRID
  function renderSOSTriggersGrid() {
    if (!sosTriggersGrid) return;
    sosTriggersGrid.innerHTML = "";

    if (sosState.triggers.length === 0) {
      sosTriggersGrid.innerHTML = `
                <div style="grid-column:1/-1;padding:32px;background:#F8FAFC;border:1px dashed rgba(20,83,182,0.25);border-radius:12px;text-align:center;">
                  <div style="margin-bottom:8px;"><i class="ph ph-warning-circle" style="font-size:36px;color:#64748B;"></i></div>
                  <div style="font-size:15px;font-weight:700;color:#092755;">No Devices Connected</div>
                  <div style="font-size:13px;color:#6E6F71;margin-top:4px;margin-bottom:16px;">Click "+ Add Device" to configure emergency triggers.</div>
                </div>
            `;
    } else {
      sosState.triggers.forEach((trig) => {
        const card = document.createElement("div");
        card.className = "section-card";
        card.style.cssText =
          "padding:18px;display:flex;flex-direction:column;justify-content:space-between;border:1px solid rgba(20,83,182,0.15);";

        const isConn = trig.status === "Connected";
        const statusBadge = isConn
          ? `<span style="font-size:11px;font-weight:700;color:#047857;background:#ECFDF5;border:1px solid #A7F3D0;padding:4px 8px;border-radius:6px;display:inline-flex;align-items:center;gap:8px;"><i class="ph ph-check-circle" style="font-size:12px;"></i> Connected</span>`
          : `<span style="font-size:11px;font-weight:700;color:#64748B;background:#F1F5F9;border:1px solid #CBD5E1;padding:4px 8px;border-radius:6px;display:inline-flex;align-items:center;gap:8px;"><i class="ph ph-warning-circle" style="font-size:12px;"></i> Not Connected</span>`;

        card.innerHTML = `
                    <div>
                      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;">
                        <div style="display:flex;align-items:center;gap:12px;">
                          ${getTriggerIconHTML(trig.type)}
                          <div>
                            <h3 style="font-size:14.5px;font-weight:700;color:#092755;margin:0 0 2px 0;">${trig.name}</h3>
                            <span class="chip-badge" style="background:#EFF3FF;color:#1A6FF3;font-size:10.5px;padding:1px 6px;border-radius:4px;font-weight:600;">${trig.type}</span>
                          </div>
                        </div>
                        ${statusBadge}
                      </div>

                      <p style="font-size:12.5px;color:#6E6F71;line-height:1.4;margin:0 0 14px 0;min-height:36px;">
                        ${trig.desc || "No additional description provided."}
                      </p>
                    </div>

                    <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:10px;border-top:1px solid rgba(20,83,182,0.08);">
                      <button type="button" class="btn btn-outline btn-xs edit-trigger-btn" data-id="${trig.id}" style="display:inline-flex;align-items:center;gap:8px;"><i class="ph ph-pencil-simple" style="font-size:12px;"></i> Edit</button>
                      <button type="button" class="btn btn-outline btn-xs delete-trigger-btn" data-id="${trig.id}" style="color:#EF4444;border-color:rgba(239,68,68,0.3);display:inline-flex;align-items:center;gap:8px;"><i class="ph ph-trash" style="font-size:12px;"></i> Delete</button>
                    </div>
                `;
        sosTriggersGrid.appendChild(card);
      });
    }

    updateSOSStepperUI();
  }

  // TRIGGER SOURCE MODAL HANDLERS

  function updateTriggerDynamicFields(type) {
    // Hide all
    const groups = document.querySelectorAll(".trigger-fields-group");
    groups.forEach((g) => (g.style.display = "none"));

    // Show relevant
    if (type === "Fire Alarm System") {
      const el = document.getElementById("fieldsFireAlarm");
      if (el) el.style.display = "flex";
    } else if (type === "Smoke Sensor") {
      const el = document.getElementById("fieldsSmokeSensor");
      if (el) el.style.display = "flex";
    } else if (type === "Webhook") {
      const el = document.getElementById("fieldsWebhook");
      if (el) el.style.display = "flex";
    } else if (type === "REST API") {
      const el = document.getElementById("fieldsRestApi");
      if (el) el.style.display = "flex";
    } else if (type === "MQTT") {
      const el = document.getElementById("fieldsMqtt");
      if (el) el.style.display = "flex";
    } else if (type === "Relay Input") {
      const el = document.getElementById("fieldsRelayInput");
      if (el) el.style.display = "flex";
    } else if (type === "WhatsApp") {
      const el = document.getElementById("fieldsWhatsApp");
      if (el) el.style.display = "flex";
    } else if (type === "Email") {
      const el = document.getElementById("fieldsEmail");
      if (el) el.style.display = "flex";
    }
  }

  // Tooltip explanations
  const triggerTooltips = {
    Webhook:
      "Another system automatically notifies Wilyer whenever an emergency event occurs.<br><br><b>Example:</b><br>Fire Alarm detects a fire<br>↓<br>Sends a secure request to Wilyer<br>↓<br>Wilyer automatically starts the configured emergency workflow.",
    "REST API":
      "Another application sends authenticated emergency events to Wilyer. This is usually configured by an IT team.",
    MQTT: "MQTT is commonly used by IoT devices and Building Management Systems to send events to Wilyer in real time.",
    "Fire Alarm System":
      "Wilyer connects directly with a physical fire alarm panel so emergency events automatically trigger configured workflows.",
    "Smoke Sensor":
      "Wilyer automatically starts the configured emergency workflow whenever the connected smoke sensor detects smoke.",
    WhatsApp:
      "Wilyer monitors a connected WhatsApp Business account. Whenever an authorized user sends configured keywords like:<br>• FIRE<br>• SOS<br>• EVAC<br><br>the configured emergency workflow automatically starts.",
    Email:
      "Wilyer monitors a configured mailbox. Whenever an incoming email matches configured sender and subject rules, the configured emergency workflow automatically starts.",
    "Relay Input":
      "Relay Input connects directly with physical controllers or alarm panels. Whenever the relay changes state, Wilyer automatically starts the configured emergency workflow.",
  };

  if (triggerTypeSelect) {
    triggerTypeSelect.addEventListener("change", (e) => {
      updateTriggerDynamicFields(e.target.value);
    });
  }

  const triggerTypeInfoIcon = document.getElementById("triggerTypeInfoIcon");
  const triggerTypeTooltip = document.getElementById("triggerTypeTooltip");
  if (triggerTypeInfoIcon && triggerTypeTooltip) {
    const showTooltip = () => {
      const type = triggerTypeSelect
        ? triggerTypeSelect.value
        : "Fire Alarm System";
      triggerTypeTooltip.innerHTML = triggerTooltips[type] || "";
      triggerTypeTooltip.style.display = "block";
    };
    const hideTooltip = () => {
      triggerTypeTooltip.style.display = "none";
    };

    triggerTypeInfoIcon.addEventListener("mouseenter", showTooltip);
    triggerTypeInfoIcon.addEventListener("mouseleave", hideTooltip);

    triggerTypeInfoIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (triggerTypeTooltip.style.display === "block") {
        hideTooltip();
      } else {
        showTooltip();
      }
    });

    document.addEventListener("click", () => {
      hideTooltip();
    });
  }

  function openTriggerModal(triggerToEdit = null) {
    if (!addTriggerModal) return;
    let setType = "Fire Alarm System";
    if (triggerToEdit) {
      if (triggerModalTitle)
        triggerModalTitle.textContent = "Edit Trigger Source";
      if (editingTriggerIdInput) editingTriggerIdInput.value = triggerToEdit.id;
      if (triggerNameInput) triggerNameInput.value = triggerToEdit.name;
      if (triggerTypeSelect) triggerTypeSelect.value = triggerToEdit.type;
      setType = triggerToEdit.type;
      if (triggerDescInput) triggerDescInput.value = triggerToEdit.desc || "";
    } else {
      if (triggerModalTitle)
        triggerModalTitle.textContent = "Add Trigger Source";
      if (editingTriggerIdInput) editingTriggerIdInput.value = "";
      if (triggerNameInput) triggerNameInput.value = "";
      if (triggerTypeSelect) triggerTypeSelect.value = "Fire Alarm System";
      setType = "Fire Alarm System";
      if (triggerDescInput) triggerDescInput.value = "";
    }

    updateTriggerDynamicFields(setType);

    addTriggerModal.classList.add("open");
  }

  function closeTriggerModal() {
    if (addTriggerModal) addTriggerModal.classList.remove("open");
  }

  if (openAddTriggerModalBtn)
    openAddTriggerModalBtn.addEventListener("click", () =>
      openTriggerModal(null),
    );
  if (closeTriggerModalBtn)
    closeTriggerModalBtn.addEventListener("click", closeTriggerModal);
  if (cancelTriggerModalBtn)
    cancelTriggerModalBtn.addEventListener("click", closeTriggerModal);

  if (saveTriggerBtn) {
    saveTriggerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const name = triggerNameInput ? triggerNameInput.value.trim() : "";
      const type = triggerTypeSelect
        ? triggerTypeSelect.value
        : "Fire Alarm System";
      const desc = triggerDescInput ? triggerDescInput.value.trim() : "";
      const status = "Connected"; // Read-only now

      if (!name) {
        showToast("Please enter a Trigger Source Name.", "error");
        return;
      }

      const editingId = editingTriggerIdInput
        ? editingTriggerIdInput.value
        : "";
      if (editingId) {
        const existing = sosState.triggers.find((t) => t.id === editingId);
        if (existing) {
          existing.name = name;
          existing.type = type;
          existing.desc = desc;
          existing.status = status;
        }
        showToast("Trigger Source updated successfully!", "success");
      } else {
        const newId = `trig-${Date.now()}`;
        sosState.triggers.push({ id: newId, name, type, desc, status });
        sosState.mappings.set(newId, {
          layout: "Fire Evacuation Layout (Fire Hazard)",
          enabled: true,
        });
        showToast("New Trigger Source added successfully!", "success");
      }

      renderSOSTriggersGrid();
      closeTriggerModal();
    });
  }

  // Trigger Grid Click (Edit / Delete)
  if (sosTriggersGrid) {
    sosTriggersGrid.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".edit-trigger-btn");
      if (editBtn) {
        const id = editBtn.getAttribute("data-id");
        const trig = sosState.triggers.find((t) => t.id === id);
        if (trig) openTriggerModal(trig);
        return;
      }

      const delBtn = e.target.closest(".delete-trigger-btn");
      if (delBtn) {
        const id = delBtn.getAttribute("data-id");
        sosState.triggers = sosState.triggers.filter((t) => t.id !== id);
        sosState.mappings.delete(id);
        showToast("Trigger Source removed.", "success");
        renderSOSTriggersGrid();
        return;
      }
    });
  }

  function getZoneCardHTML(trigId, selectedZones) {
    selectedZones = selectedZones || [];
    return sosState.zones
      .map((z) => {
        const isChecked = selectedZones.includes(z.id) ? "checked" : "";
        const cardBg = isChecked ? "#F8FAFC" : "#ffffff";
        const cardBorder = isChecked ? "#1A6FF3" : "rgba(20,83,182,0.15)";
        return `
                <label class="zone-card" style="border:1px solid ${cardBorder};border-radius:10px;padding:12px;display:flex;align-items:flex-start;gap:10px;cursor:pointer;transition:all 0.2s ease;background:${cardBg};">
                  <input type="checkbox" class="zone-checkbox" data-trig-id="${trigId}" data-zone-id="${z.id}" ${isChecked} style="margin-top:2px;cursor:pointer;accent-color:#1A6FF3;transform:scale(1.1);" />
                  <div style="flex:1;">
                    <div style="font-size:13.5px;font-weight:700;color:#092755;margin-bottom:2px;">${z.name}</div>
                    <div style="font-size:12px;color:#6E6F71;">${z.screens} Screens</div>
                  </div>
                </label>
            `;
      })
      .join("");
  }

  // RENDER STEP 2: MAPPINGS LIST
  function renderSOSMappingsList() {
    if (!sosMappingsList) return;
    sosMappingsList.innerHTML = "";

    let mappedCount = 0;
    sosState.triggers.forEach((trig) => {
      const mapObj = sosState.mappings.get(trig.id) || {
        layout: sosState.availableLayouts[0],
        enabled: true,
        zones: [],
      };
      if (mapObj.layout && mapObj.zones && mapObj.zones.length > 0)
        mappedCount++;

      const row = document.createElement("div");
      row.className = "section-card";
      row.style.cssText = "padding:20px;border:1px solid rgba(20,83,182,0.15);";

      const layoutOptionsHTML = sosState.availableLayouts
        .map(
          (l) =>
            `<option value="${l}" ${mapObj.layout === l ? "selected" : ""}>${l}</option>`,
        )
        .join("");

      row.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid rgba(20,83,182,0.1);flex-wrap:wrap;gap:10px;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    ${getTriggerIconHTML(trig.type)}
                    <div>
                      <div style="font-size:15px;font-weight:700;color:#092755;">${trig.name}</div>
                      <div style="font-size:12px;color:#4B5563;">Source Type: <span class="chip-badge" style="background:#EFF3FF;color:#1A6FF3;border:1px solid rgba(20,83,182,0.2);font-size:10.5px;padding:2px 8px;border-radius:4px;font-weight:600;">${trig.type}</span></div>
                    </div>
                  </div>
                  <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:12px;color:#4B5563;font-weight:600;">Mapping Status:</span>
                    <label class="toggle-switch">
                      <input type="checkbox" class="mapping-enable-toggle" data-id="${trig.id}" ${mapObj.enabled ? "checked" : ""}>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr max-content;gap:14px;align-items:end;${mapObj.enabled ? "" : "opacity:0.5;pointer-events:none;"}">
                  <div>
                    <label class="form-label" style="font-size:12px;margin-bottom:6px;font-weight:700;color:#092755;">EMERGENCY CONTENT LAYOUT *</label>
                    <select class="dash-input dash-select mapping-layout-select" data-id="${trig.id}" style="height:40px;font-size:13.5px;font-weight:600;">
                      ${layoutOptionsHTML}
                    </select>
                  </div>
                  <div>
                    <button type="button" class="btn btn-outline btn-sm preview-layout-btn" data-id="${trig.id}" style="display:inline-flex;align-items:center;justify-content:center;gap:6px; height:40px; padding:0 14px;"><i class="ph ph-eye"></i> Preview</button>
                  </div>
                </div>

                <!-- Display Zones Selection row -->
                <div class="form-group-dash" style="margin-top: 20px; ${mapObj.enabled ? "" : "opacity:0.5;pointer-events:none;"}">
                  <label class="form-label" style="font-size:12px;margin-bottom:10px;font-weight:700;color:#092755;text-transform:uppercase;">TARGET DISPLAY ZONES *</label>
                  
                  <div class="sos-zones-grid" data-trig-id="${trig.id}" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(160px, 1fr));gap:12px;">
                    ${getZoneCardHTML(trig.id, mapObj.zones)}
                  </div>
                </div>
            `;
      sosMappingsList.appendChild(row);
    });

    if (sosStep2MappedBadge) {
      sosStep2MappedBadge.textContent = `${mappedCount} of ${sosState.triggers.length} Configured`;
    }

    updateSOSStepperUI();
  }

  // Step 2 Mapping Event Delegation
  if (sosMappingsList) {
    // Toggle dropdown open/close
    sosMappingsList.addEventListener("click", (e) => {
      const prevBtn = e.target.closest(".preview-layout-btn");
      if (prevBtn) {
        const trigId = prevBtn.getAttribute("data-id");
        const trig = sosState.triggers.find((t) => t.id === trigId);
        const mapObj = sosState.mappings.get(trigId);
        openSOSPreviewModal(
          trig?.name || "Trigger Source",
          trig?.type || "Fire Alarm",
          mapObj?.layout || "Fire Evacuation Layout",
        );
        return;
      }
    });

    sosMappingsList.addEventListener("change", (e) => {
      const select = e.target.closest(".mapping-layout-select");
      if (select) {
        const trigId = select.getAttribute("data-id");
        const mapObj = sosState.mappings.get(trigId) || {
          enabled: true,
          zones: [],
        };
        mapObj.layout = select.value;
        sosState.mappings.set(trigId, mapObj);
        updateSOSStepperUI();
        return;
      }

      const toggle = e.target.closest(".mapping-enable-toggle");
      if (toggle) {
        const trigId = toggle.getAttribute("data-id");
        const mapObj = sosState.mappings.get(trigId) || {
          layout: sosState.availableLayouts[0],
          zones: [],
        };
        mapObj.enabled = toggle.checked;
        sosState.mappings.set(trigId, mapObj);
        renderSOSMappingsList();
        return;
      }

      const checkbox = e.target.closest(".zone-checkbox");
      if (checkbox) {
        const trigId = checkbox.getAttribute("data-trig-id");
        const zoneId = checkbox.getAttribute("data-zone-id");
        const mapObj = sosState.mappings.get(trigId) || {
          enabled: true,
          layout: sosState.availableLayouts[0],
          zones: [],
        };
        mapObj.zones = mapObj.zones || [];

        if (checkbox.checked) {
          if (!mapObj.zones.includes(zoneId)) mapObj.zones.push(zoneId);
        } else {
          mapObj.zones = mapObj.zones.filter((z) => z !== zoneId);
        }

        sosState.mappings.set(trigId, mapObj);

        // Re-render to show updated card styling
        renderSOSMappingsList();
        e.stopPropagation();
        return;
      }
    });

    // Search options filtering
    sosMappingsList.addEventListener("keyup", (e) => {
      const search = e.target.closest(".multi-select-search");
      if (search) {
        const query = search.value.toLowerCase().trim();
        const dropdown = search.closest(".multi-select-dropdown");
        dropdown.querySelectorAll(".zone-opt-item").forEach((item) => {
          const name = item.getAttribute("data-name");
          if (name.includes(query)) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      }
    });
  }

  // Document click to close open multi-selects
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".wilyer-multi-select")) {
      document.querySelectorAll(".multi-select-dropdown").forEach((d) => {
        d.style.display = "none";
      });
    }
  });

  // Zone Icon mapping helper based on locations
  function getZoneIconClass(zoneName) {
    const name = (zoneName || "").toLowerCase();
    if (name.includes("reception")) return "ph-door";
    if (name.includes("lobby")) return "ph-building";
    if (name.includes("conference")) return "ph-presentation";
    if (name.includes("parking")) return "ph-car";
    if (name.includes("floor")) return "ph-building-apartment";
    if (name.includes("basement")) return "ph-warehouse";
    return "ph-map-pin";
  }

  function renderSOSStep3Review() {
    const reviewList = document.getElementById("sosStep3ReviewList");
    if (!reviewList) return;
    reviewList.innerHTML = "";

    sosState.triggers.forEach((trig) => {
      const mapObj = sosState.mappings.get(trig.id);
      if (
        mapObj &&
        mapObj.enabled &&
        mapObj.layout &&
        mapObj.zones &&
        mapObj.zones.length > 0
      ) {
        let screensCount = 0;
        const zoneTagsHTML = mapObj.zones
          .map((zId) => {
            const z = sosState.zones.find((zone) => zone.id === zId);
            if (z) {
              screensCount += z.screens;
              return `<span style="background:#EFF3FF;color:#092755;border:1px solid rgba(20,83,182,0.2);padding:2px 8px;border-radius:6px;font-size:11.5px;font-weight:600;">${z.name}</span>`;
            }
            return "";
          })
          .join("");

        const card = document.createElement("div");
        card.className = "section-card";
        card.style.cssText =
          "padding:16px; border:1px solid rgba(20,83,182,0.1); display:flex; flex-direction:column; gap:12px;";
        card.innerHTML = `
                  <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px;">
                    <div style="display:flex; align-items:flex-start; gap:12px;">
                      ${getTriggerIconHTML(trig.type)}
                      <div>
                        <h4 style="font-size:14px; font-weight:700; color:#092755; margin:0; line-height:1.2; margin-bottom:4px;">${trig.name}</h4>
                        <div style="font-size:11.5px; color:#4B5563;">Source Type: <span class="chip-badge" style="background:#EFF3FF;color:#1A6FF3;border:1px solid rgba(20,83,182,0.2);font-size:10px;padding:1px 6px;border-radius:4px;">${trig.type}</span></div>
                      </div>
                    </div>
                    <span style="font-size:11.5px; font-weight:700; color:#047857; background:#ECFDF5; border:1px solid #A7F3D0; padding:4px 10px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;"><i class="ph ph-screen"></i> ${screensCount} Screens</span>
                  </div>
                  <div style="display:grid; grid-template-columns:max-content minmax(0,1fr); column-gap:6px; row-gap:6px; font-size:13px; border-top:1px solid rgba(20,83,182,0.06); padding-top:10px;">
                    <div style="color:#4B5563; font-weight:600;">Emergency Layout:</div>
                    <div style="color:#EF4444; font-weight:700;">${mapObj.layout}</div>
                    <div style="color:#4B5563; font-weight:600;">Assigned Zones:</div>
                    <div style="color:#092755; font-weight:600; display:flex; flex-wrap:wrap; gap:6px;">
                      ${zoneTagsHTML}
                    </div>
                  </div>
                `;
        reviewList.appendChild(card);
      }
    });

    updateSOSStepperUI();
  }

  // SOS SCREEN PREVIEW MODAL LOGIC
  const sosPreviewModal = document.getElementById("sosPreviewModal");
  const closeSOSPreviewBtn2 = document.getElementById("closeSOSPreviewBtn2");

  const sosPreviewLayoutTitle = document.getElementById(
    "sosPreviewLayoutTitle",
  );
  const sosPreviewHazardBadge = document.getElementById(
    "sosPreviewHazardBadge",
  );
  const sosPreviewDescText = document.getElementById("sosPreviewDescText");
  const sosPreviewInstructionText = document.getElementById(
    "sosPreviewInstructionText",
  );
  const sosPreviewLayoutIdText = document.getElementById(
    "sosPreviewLayoutIdText",
  ); // kept in DOM for backwards compat but no longer used in layout

  function openSOSPreviewModal(triggerName, triggerType, layoutName) {
    if (!sosPreviewModal) return;

    // Define emergency themes
    const previewThemes = {
      fire: {
        bg: "linear-gradient(180deg, #1E0C1B 0%, #0F0510 100%)",
        border: "2px solid #EF4444",
        shadow: "0 0 35px rgba(239, 68, 68, 0.25)",
        iconClass: "ph-flame",
        iconBg: "#EF4444",
        iconColor: "#FFFFFF",
        overrideText: "EMERGENCY BROADCAST OVERRIDE",
        layoutTitle: "FIRE EVACUATION LAYOUT",
        badgeText: "ALARM ACTIVE",
        badgeIconClass: "ph-bell-ringing",
        badgeBg: "rgba(239,68,68,0.2)",
        badgeBorder: "1px solid #EF4444",
        badgeColor: "#FCA5A5",
        hazardText: "⚠️ HAZARD DETECTED: FIRE ALARM",
        hazardBg: "rgba(239,68,68,0.15)",
        hazardBorder: "1px solid #EF4444",
        hazardColor: "#FCA5A5",
        desc: "High-contrast red emergency layout with animated exit arrows, assembly point map & alarm tone beacon.",
        instruction: "PROCEED IMMEDIATELY TO NEAREST EMERGENCY EXIT",
        instructionBg: "rgba(239,68,68,0.2)",
        instructionBorder: "1px solid #DC2626",
        instructionLabelColor: "#FCA5A5",
        routeText: "EVACUATION ROUTE B",
        routeDesc: "Stairwell East • Ground Exit",
        routeIcon: "ph-arrow-right",
        routeIconBg: "#10B981",
        routeColor: "#34D399",
      },
      smoke: {
        bg: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
        border: "2px solid #64748B",
        shadow: "0 0 35px rgba(100, 116, 139, 0.25)",
        iconClass: "ph-wind",
        iconBg: "#64748B",
        iconColor: "#FFFFFF",
        overrideText: "AIR QUALITY OVERRIDE",
        layoutTitle: "SMOKE WARNING LAYOUT",
        badgeText: "SMOKE ACTIVE",
        badgeIconClass: "ph-warning",
        badgeBg: "rgba(100,116,139,0.2)",
        badgeBorder: "1px solid #64748B",
        badgeColor: "#CBD5E1",
        hazardText: "⚠️ HAZARD DETECTED: SMOKE DETECTOR",
        hazardBg: "rgba(100,116,139,0.15)",
        hazardBorder: "1px solid #64748B",
        hazardColor: "#CBD5E1",
        desc: "Dark smoke-themed slate evacuation layout with air quality indicators, filter mask notices, and ventilation overrides.",
        instruction: "EVACUATE IMMEDIATELY & SEEK FRESH AIR",
        instructionBg: "rgba(100,116,139,0.2)",
        instructionBorder: "1px solid #64748B",
        instructionLabelColor: "#CBD5E1",
        routeText: "EVACUATION ROUTE C",
        routeDesc: "North Exit • Assembly Point C",
        routeIcon: "ph-mask-happy",
        routeIconBg: "#64748B",
        routeColor: "#94A3B8",
      },
      power: {
        bg: "linear-gradient(180deg, #2E2500 0%, #141000 100%)",
        border: "2px solid #F59E0B",
        shadow: "0 0 35px rgba(245, 158, 11, 0.25)",
        iconClass: "ph-lightning",
        iconBg: "#F59E0B",
        iconColor: "#FFFFFF",
        overrideText: "SYSTEM POWER OVERRIDE",
        layoutTitle: "POWER FAILURE LAYOUT",
        badgeText: "BACKUP POWER ACTIVE",
        badgeIconClass: "ph-lightning",
        badgeBg: "rgba(245,158,11,0.2)",
        badgeBorder: "1px solid #F59E0B",
        badgeColor: "#FDE68A",
        hazardText: "⚠️ ALERT: MAIN POWER FAILURE",
        hazardBg: "rgba(245,158,11,0.15)",
        hazardBorder: "1px solid #F59E0B",
        hazardColor: "#FDE68A",
        desc: "High-visibility amber alert layout displaying backup generator status, UPS battery runtime, and key safety checkpoints.",
        instruction: "USE EMERGENCY LIGHTS & FOLLOW SAFETY PATHS",
        instructionBg: "rgba(245,158,11,0.2)",
        instructionBorder: "1px solid #D97706",
        instructionLabelColor: "#FDE68A",
        routeText: "UPS STATUS: ACTIVE",
        routeDesc: "32 Mins Remaining • Emergency Lighting On",
        routeIcon: "ph-battery-charging",
        routeIconBg: "#F59E0B",
        routeColor: "#FBBF24",
      },
      security: {
        bg: "linear-gradient(180deg, #0C1E36 0%, #050E1A 100%)",
        border: "2px solid #1D4ED8",
        shadow: "0 0 35px rgba(29, 78, 216, 0.25)",
        iconClass: "ph-shield-warning",
        iconBg: "#1D4ED8",
        iconColor: "#FFFFFF",
        overrideText: "LOCKDOWN OVERRIDE ACTIVE",
        layoutTitle: "SECURITY LOCKDOWN LAYOUT",
        badgeText: "LOCKDOWN ENGAGED",
        badgeIconClass: "ph-shield-check",
        badgeBg: "rgba(29,78,216,0.2)",
        badgeBorder: "1px solid #1D4ED8",
        badgeColor: "#93C5FD",
        hazardText: "⚠️ HAZARD DETECTED: SECURITY ALERT",
        hazardBg: "rgba(29,78,216,0.15)",
        hazardBorder: "1px solid #1D4ED8",
        hazardColor: "#93C5FD",
        desc: "Secure blue lockdown alert screen displaying gate closure status, badge authentication warnings, and check-in procedures.",
        instruction: "LOCKDOWN ACTIVE - STAY INSIDE AND AWAY FROM WINDOWS",
        instructionBg: "rgba(29,78,216,0.2)",
        instructionBorder: "1px solid #1E40AF",
        instructionLabelColor: "#93C5FD",
        routeText: "SAFE ZONE ASSEMBLY",
        routeDesc: "Secure Room Inner Corridors",
        routeIcon: "ph-keyholder",
        routeIconBg: "#1D4ED8",
        routeColor: "#60A5FA",
      },
      flood: {
        bg: "linear-gradient(180deg, #0A2540 0%, #030F26 100%)",
        border: "2px solid #0284C7",
        shadow: "0 0 35px rgba(2, 132, 199, 0.25)",
        iconClass: "ph-waves",
        iconBg: "#0284C7",
        iconColor: "#FFFFFF",
        overrideText: "FLOOD ADVISORY OVERRIDE",
        layoutTitle: "FLOOD ALERT LAYOUT",
        badgeText: "FLOOD ACTIVE",
        badgeIconClass: "ph-waves",
        badgeBg: "rgba(2,132,199,0.2)",
        badgeBorder: "1px solid #0284C7",
        badgeColor: "#7DD3FC",
        hazardText: "⚠️ WATER INTRUSION DETECTED",
        hazardBg: "rgba(2,132,199,0.15)",
        hazardBorder: "1px solid #0284C7",
        hazardColor: "#7DD3FC",
        desc: "Cyan/blue layout displaying flood level warnings, shutoff valve locations, and high-ground escape routes.",
        instruction: "PROCEED IMMEDIATELY TO UPPER FLOORS",
        instructionBg: "rgba(2,132,199,0.2)",
        instructionBorder: "1px solid #0369A1",
        instructionLabelColor: "#7DD3FC",
        routeText: "HIGH-GROUND ASSEMBLY",
        routeDesc: "Level 3 Offices & Roof Access",
        routeIcon: "ph-arrow-up",
        routeIconBg: "#0284C7",
        routeColor: "#38BDF8",
      },
    };

    const nameLower = (triggerName || "").toLowerCase();
    const typeLower = (triggerType || "").toLowerCase();
    const layoutLower = (layoutName || "").toLowerCase();

    let theme = previewThemes.fire; // default fallback

    if (
      layoutLower.includes("fire") ||
      typeLower.includes("fire") ||
      nameLower.includes("fire")
    ) {
      theme = previewThemes.fire;
    } else if (
      layoutLower.includes("smoke") ||
      layoutLower.includes("air quality") ||
      typeLower.includes("smoke") ||
      nameLower.includes("smoke")
    ) {
      theme = previewThemes.smoke;
    } else if (
      layoutLower.includes("power") ||
      layoutLower.includes("failure") ||
      layoutLower.includes("generator") ||
      typeLower.includes("power") ||
      nameLower.includes("power")
    ) {
      theme = previewThemes.power;
    } else if (
      layoutLower.includes("security") ||
      layoutLower.includes("lockdown") ||
      typeLower.includes("security") ||
      nameLower.includes("security")
    ) {
      theme = previewThemes.security;
    } else if (
      layoutLower.includes("flood") ||
      layoutLower.includes("water") ||
      typeLower.includes("flood") ||
      nameLower.includes("flood")
    ) {
      theme = previewThemes.flood;
    }

    // Apply theme properties dynamically to DOM elements
    const frame = document.getElementById("sosPreviewFrame");
    const headerIconBox = document.getElementById("sosPreviewHeaderIconBox");
    const headerIcon = document.getElementById("sosPreviewHeaderIcon");
    const headerOverrideLabel = document.getElementById(
      "sosPreviewHeaderOverrideLabel",
    );
    const alarmBadge = document.getElementById("sosPreviewAlarmBadge");
    const alarmBadgeIcon = document.getElementById("sosPreviewAlarmBadgeIcon");
    const alarmBadgeText = document.getElementById("sosPreviewAlarmBadgeText");
    const hazardBadge = document.getElementById("sosPreviewHazardBadge");
    const descText = document.getElementById("sosPreviewDescText");
    const instructionBox = document.getElementById("sosPreviewInstructionBox");
    const instructionLabel = document.getElementById(
      "sosPreviewInstructionLabel",
    );
    const instructionText = document.getElementById(
      "sosPreviewInstructionText",
    );
    const routeContainer = document.getElementById("sosPreviewRouteContainer");
    const routeIconBox = document.getElementById("sosPreviewRouteIconBox");
    const routeIcon = document.getElementById("sosPreviewRouteIcon");
    const routeTitle = document.getElementById("sosPreviewRouteTitle");
    const routeDesc = document.getElementById("sosPreviewRouteDesc");
    const layoutIdText = document.getElementById("sosPreviewLayoutIdText");

    if (frame) {
      frame.style.background = theme.bg;
      frame.style.border = theme.border;
      frame.style.boxShadow = theme.shadow;
    }
    if (headerIconBox) {
      headerIconBox.style.background = theme.iconBg;
      headerIconBox.style.color = theme.iconColor;
    }
    if (headerIcon) {
      headerIcon.className = `ph ${theme.iconClass}`;
    }
    if (headerOverrideLabel) {
      headerOverrideLabel.textContent = theme.overrideText;
      headerOverrideLabel.style.color = theme.hazardColor;
    }
    if (sosPreviewLayoutTitle) {
      sosPreviewLayoutTitle.textContent = theme.layoutTitle;
    }
    if (alarmBadge) {
      alarmBadge.style.background = theme.badgeBg;
      alarmBadge.style.border = theme.badgeBorder;
      alarmBadge.style.color = theme.badgeColor;
    }
    if (alarmBadgeIcon) {
      alarmBadgeIcon.className = `ph ${theme.badgeIconClass}`;
    }
    if (alarmBadgeText) {
      alarmBadgeText.textContent = theme.badgeText;
    }
    if (hazardBadge) {
      hazardBadge.innerHTML = `<i class="ph ph-warning-circle" style="font-size:14px;margin-right:6px;"></i> ${theme.hazardText.replace("⚠️ ", "")}`;
      hazardBadge.style.background = theme.hazardBg;
      hazardBadge.style.border = theme.hazardBorder;
      hazardBadge.style.color = theme.hazardColor;
    }
    if (descText) {
      descText.textContent = theme.desc;
    }
    if (instructionBox) {
      instructionBox.style.background = theme.instructionBg;
      instructionBox.style.border = theme.instructionBorder;
    }
    if (instructionLabel) {
      instructionLabel.style.color = theme.instructionLabelColor;
    }
    if (instructionText) {
      instructionText.textContent = theme.instruction;
    }
    if (routeContainer) {
      routeContainer.style.border = `1px solid ${theme.badgeBorder.split(" ").slice(2).join(" ")}`;
    }
    if (routeIconBox) {
      routeIconBox.style.background = theme.routeIconBg;
      routeIconBox.style.boxShadow = `0 0 16px ${theme.routeIconBg}80`;
    }
    if (routeIcon) {
      routeIcon.className = `ph ${theme.routeIcon}`;
    }
    if (routeTitle) {
      routeTitle.textContent = theme.routeText;
      routeTitle.style.color = theme.routeColor;
    }
    if (routeDesc) {
      routeDesc.textContent = theme.routeDesc;
    }

    sosPreviewModal.classList.add("open");
  }

  function closeSOSPreviewModal() {
    if (sosPreviewModal) sosPreviewModal.classList.remove("open");
  }

  if (closeSOSPreviewBtn2)
    closeSOSPreviewBtn2.addEventListener("click", closeSOSPreviewModal);

  // RENDER STEP 4: REVIEW & ACTIVATE
  function renderSOSReviewPage() {
    let totalTriggers = 0;
    const uniqueLayouts = new Set();
    const uniqueZones = new Set();
    let totalScreens = 0;

    sosState.triggers.forEach((trig) => {
      const mapObj = sosState.mappings.get(trig.id);
      if (
        mapObj &&
        mapObj.enabled &&
        mapObj.layout &&
        mapObj.zones &&
        mapObj.zones.length > 0
      ) {
        totalTriggers++;
        uniqueLayouts.add(mapObj.layout);
        mapObj.zones.forEach((zId) => {
          uniqueZones.add(zId);
        });
      }
    });

    // Sum up deduplicated screens
    uniqueZones.forEach((zId) => {
      const z = sosState.zones.find((zone) => zone.id === zId);
      if (z) totalScreens += z.screens;
    });

    // Header KPI Cards
    const trigCountEl = document.getElementById("sosStep4TriggerCount");
    const layoutCountEl = document.getElementById("sosStep4LayoutCount");
    const zoneCountEl = document.getElementById("sosStep4ZoneCount");
    const screenCountEl = document.getElementById("sosStep4ScreenCount");

    if (trigCountEl) trigCountEl.textContent = `${totalTriggers}`;
    if (layoutCountEl) layoutCountEl.textContent = `${uniqueLayouts.size}`;
    if (zoneCountEl) zoneCountEl.textContent = `${uniqueZones.size}`;
    if (screenCountEl) screenCountEl.textContent = `${totalScreens}`;

    // Right Zones Review List
    const zonesReviewList = document.getElementById("sosStep4ZonesReviewList");
    if (zonesReviewList) {
      zonesReviewList.innerHTML = "";
      uniqueZones.forEach((zId) => {
        const z = sosState.zones.find((zone) => zone.id === zId);
        if (z) {
          const item = document.createElement("div");
          item.style.cssText =
            "background:#F8FAFC;border:1px solid rgba(20,83,182,0.12);border-radius:8px;padding:10px 12px;";
          item.innerHTML = `
                        <div style="font-size:13px;font-weight:700;color:#092755;">${z.name}</div>
                        <div style="font-size:11.5px;color:#10b981;font-weight:600;">${z.screens} Screens</div>
                    `;
          zonesReviewList.appendChild(item);
        }
      });
      if (uniqueZones.size === 0) {
        zonesReviewList.innerHTML =
          '<span style="font-size:12px;color:#6E6F71;grid-column:span 2;">No zones assigned.</span>';
      }
    }
  }

  // Step 4 Actions: Activate Workflow & Test Signal
  if (activateSOSWorkflowBtn) {
    activateSOSWorkflowBtn.addEventListener("click", () => {
      sosState.isActivated = true;
      if (sosGlobalStatusBadge) {
        sosGlobalStatusBadge.textContent = "Status: Active & Armed";
        sosGlobalStatusBadge.style.background = "#ECFDF5";
        sosGlobalStatusBadge.style.color = "#047857";
        sosGlobalStatusBadge.style.border = "1px solid #A7F3D0";
      }
      if (sosActivationSuccessBanner) {
        sosActivationSuccessBanner.style.display = "block";
      }
      showToast(
        "⚡ SOS Emergency Workflow Activated & Armed Successfully!",
        "success",
      );
    });
  }

  // Dry Run Confirmation Modal Event Listeners
  const sosDryRunConfirmModal = document.getElementById(
    "sosDryRunConfirmModal",
  );
  const closeSosDryRunConfirmModalBtn = document.getElementById(
    "closeSosDryRunConfirmModalBtn",
  );
  const cancelSosDryRunConfirmBtn = document.getElementById(
    "cancelSosDryRunConfirmBtn",
  );
  const confirmSosDryRunConfirmBtn = document.getElementById(
    "confirmSosDryRunConfirmBtn",
  );

  if (sosDryRunBtn) {
    sosDryRunBtn.addEventListener("click", () => {
      if (sosDryRunConfirmModal) {
        sosDryRunConfirmModal.classList.add("open");
      }
    });
  }

  if (closeSosDryRunConfirmModalBtn) {
    closeSosDryRunConfirmModalBtn.addEventListener("click", () => {
      if (sosDryRunConfirmModal) sosDryRunConfirmModal.classList.remove("open");
    });
  }

  if (cancelSosDryRunConfirmBtn) {
    cancelSosDryRunConfirmBtn.addEventListener("click", () => {
      if (sosDryRunConfirmModal) sosDryRunConfirmModal.classList.remove("open");
    });
  }

  if (confirmSosDryRunConfirmBtn) {
    confirmSosDryRunConfirmBtn.addEventListener("click", () => {
      if (sosDryRunConfirmModal) sosDryRunConfirmModal.classList.remove("open");
      showToast(
        "📡 Dry Run Signal broadcasted successfully to all selected zones.",
        "success",
      );
    });
  }

  // ==========================================================================
  // MANUAL EMERGENCY BROADCAST TESTING (MODAL POPULATION & LOGIC)
  // ==========================================================================
  const triggerTestBroadcastBtn = document.getElementById(
    "triggerTestBroadcastBtn",
  );
  const sosTestBroadcastModal = document.getElementById(
    "sosTestBroadcastModal",
  );
  const closeSosTestBroadcastModalBtn = document.getElementById(
    "closeSosTestBroadcastModalBtn",
  );
  const cancelSosTestBroadcastBtn = document.getElementById(
    "cancelSosTestBroadcastBtn",
  );
  const runAnotherTestBtn = document.getElementById("runAnotherTestBtn");
  const doneSosTestBroadcastBtn = document.getElementById(
    "doneSosTestBroadcastBtn",
  );

  // Testing mode tabs
  const sosTestModeEntireBtn = document.getElementById("sosTestModeEntireBtn");
  const sosTestModeSpecificBtn = document.getElementById(
    "sosTestModeSpecificBtn",
  );
  const sosTestZoneMultiSelectContainer = document.getElementById(
    "sosTestZoneMultiSelectContainer",
  );

  // Zone select inside modal
  const sosTestZoneMultiSelect = document.getElementById(
    "sosTestZoneMultiSelect",
  );
  const sosTestZoneMultiSelectVal = document.getElementById(
    "sosTestZoneMultiSelectVal",
  );
  const sosTestZoneSearch = document.getElementById("sosTestZoneSearch");
  const sosTestZoneSelectAllBtn = document.getElementById(
    "sosTestZoneSelectAllBtn",
  );
  const sosTestZoneClearAllBtn = document.getElementById(
    "sosTestZoneClearAllBtn",
  );
  const sosTestZoneOptionsList = document.getElementById(
    "sosTestZoneOptionsList",
  );

  // Resolution card elements
  const sosTestResZones = document.getElementById("sosTestResZones");
  const sosTestResScreens = document.getElementById("sosTestResScreens");
  const sosTestResLayoutsList = document.getElementById(
    "sosTestResLayoutsList",
  );

  // Confirmation State elements
  const sosTestConfirmBody = document.getElementById("sosTestConfirmBody");
  const sosTestConfirmInput = document.getElementById("sosTestConfirmInput");
  const sosConfirmBackBtn = document.getElementById("sosConfirmBackBtn");
  const sosConfirmTestBroadcastBtn = document.getElementById(
    "sosConfirmTestBroadcastBtn",
  );
  const sosConfirmSummaryZones = document.getElementById(
    "sosConfirmSummaryZones",
  );
  const sosConfirmSummaryScreens = document.getElementById(
    "sosConfirmSummaryScreens",
  );
  const sosConfirmSummaryLayouts = document.getElementById(
    "sosConfirmSummaryLayouts",
  );
  const sosConfirmSummaryTriggers = document.getElementById(
    "sosConfirmSummaryTriggers",
  );

  // Base layout views
  const sosTestModalBody = document.getElementById("sosTestModalBody");
  const sosTestLoadingBody = document.getElementById("sosTestLoadingBody");
  const sosTestSuccessBody = document.getElementById("sosTestSuccessBody");
  const sosTestModalFooter = document.getElementById("sosTestModalFooter");
  const sosTestLoadingStatus = document.getElementById("sosTestLoadingStatus");
  const sosStartTestBtn = document.getElementById("sosStartTestBtn");

  // Success View Elements
  const sosSummaryCardZones = document.getElementById("sosSummaryCardZones");
  const sosSummaryCardScreens = document.getElementById(
    "sosSummaryCardScreens",
  );
  const sosSummaryCardLayouts = document.getElementById(
    "sosSummaryCardLayouts",
  );
  const sosSummaryCardCompleted = document.getElementById(
    "sosSummaryCardCompleted",
  );
  const sosSummaryCardDuration = document.getElementById(
    "sosSummaryCardDuration",
  );

  let currentTestMode = "entire"; // 'entire' or 'specific'
  let selectedTestZones = []; // Array of zone IDs chosen for specific testing

  // Helper: get all display zones that are configured in Step 2
  function getConfiguredStep2Zones() {
    const configuredZoneIds = new Set();
    sosState.triggers.forEach((trig) => {
      const mapObj = sosState.mappings.get(trig.id);
      if (mapObj && mapObj.enabled && mapObj.zones) {
        mapObj.zones.forEach((zId) => configuredZoneIds.add(zId));
      }
    });
    return sosState.zones.filter((z) => configuredZoneIds.has(z.id));
  }

  // Helper: get active layouts and trigger sources based on selected zone IDs
  function resolveTestMappings(zoneIds) {
    const resolved = []; // Array of { layout, triggerName, zoneNames: [] }
    sosState.triggers.forEach((trig) => {
      const mapObj = sosState.mappings.get(trig.id);
      if (mapObj && mapObj.enabled && mapObj.zones) {
        const intersectingZones = mapObj.zones.filter((zId) =>
          zoneIds.includes(zId),
        );
        if (intersectingZones.length > 0) {
          const zoneNames = intersectingZones
            .map((zId) => {
              const z = sosState.zones.find((zone) => zone.id === zId);
              return z ? z.name : "";
            })
            .filter(Boolean);

          resolved.push({
            layout: mapObj.layout,
            triggerName: trig.name,
            zoneNames: zoneNames,
            screens: intersectingZones.reduce((sum, zId) => {
              const z = sosState.zones.find((zone) => zone.id === zId);
              return sum + (z ? z.screens : 0);
            }, 0),
          });
        }
      }
    });
    return resolved;
  }

  function renderTestModalResolution() {
    let zonesToTest = [];
    if (currentTestMode === "entire") {
      zonesToTest = getConfiguredStep2Zones();
    } else {
      zonesToTest = sosState.zones.filter((z) =>
        selectedTestZones.includes(z.id),
      );
    }

    const totalScreens = zonesToTest.reduce((sum, z) => sum + z.screens, 0);
    if (sosTestResZones)
      sosTestResZones.textContent = `${zonesToTest.length} Zones`;
    if (sosTestResScreens)
      sosTestResScreens.textContent = `${totalScreens} Screens`;

    const resolved = resolveTestMappings(zonesToTest.map((z) => z.id));
    if (sosTestResLayoutsList) {
      sosTestResLayoutsList.innerHTML = "";
      if (resolved.length === 0) {
        sosTestResLayoutsList.innerHTML = `
                    <div style="font-size:12.5px;color:#4B5563;text-align:center;padding:10px 0;font-weight:500;">No active layout mappings resolved.</div>
                `;
      } else {
        resolved.forEach((item) => {
          const row = document.createElement("div");
          row.style.cssText =
            "background:#ffffff;border:1px solid rgba(20,83,182,0.06);border-radius:6px;padding:8px 12px;display:flex;flex-direction:column;gap:4px;";
          row.innerHTML = `
                        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;">
                          <span style="font-weight:700;color:#EF4444;font-size:13px;">• ${item.layout}</span>
                          <span style="font-size:11.5px;color:#4B5563;margin-left:auto;">via ${item.triggerName}</span>
                        </div>
                        <div style="font-size:11.5px;color:#2563EB;font-weight:600;display:flex;align-items:center;gap:4px;padding-left:10px;">
                          <i class="ph ph-arrow-right" style="font-size:10px;"></i> ${item.zoneNames.join(", ")} (${item.screens} Screens)
                        </div>
                    `;
          sosTestResLayoutsList.appendChild(row);
        });
      }
    }
  }

  function renderTestModalZonesList() {
    if (!sosTestZoneOptionsList) return;
    sosTestZoneOptionsList.innerHTML = "";

    const configuredZones = getConfiguredStep2Zones();
    configuredZones.forEach((z) => {
      const isChecked = selectedTestZones.includes(z.id) ? "checked" : "";
      const row = document.createElement("div");
      row.className = "test-zone-opt-item";
      row.setAttribute("data-name", z.name.toLowerCase());
      row.style.cssText =
        "display:flex;align-items:center;gap:10px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:13px;color:#092755;";
      row.innerHTML = `
                <input type="checkbox" class="test-zone-checkbox" data-id="${z.id}" ${isChecked} style="cursor:pointer;" />
                <span style="font-weight:600;">${z.name}</span>
                <span style="font-size:11.5px;color:#4B5563;margin-left:auto;font-weight:500;">${z.screens} Screens</span>
            `;
      sosTestZoneOptionsList.appendChild(row);
    });

    if (sosTestZoneMultiSelectVal) {
      if (selectedTestZones.length === 0) {
        sosTestZoneMultiSelectVal.textContent = "Select Zones...";
      } else if (selectedTestZones.length === configuredZones.length) {
        sosTestZoneMultiSelectVal.textContent = "All Configured Zones Selected";
      } else if (selectedTestZones.length > 2) {
        sosTestZoneMultiSelectVal.textContent = `${selectedTestZones.length} Zones Selected`;
      } else {
        sosTestZoneMultiSelectVal.textContent = selectedTestZones
          .map((id) => {
            const z = sosState.zones.find((zone) => zone.id === id);
            return z ? z.name : "";
          })
          .filter(Boolean)
          .join(", ");
      }
    }
  }

  function initTestModalFlow() {
    currentTestMode = "entire";
    selectedTestZones = getConfiguredStep2Zones().map((z) => z.id);

    if (sosTestModeEntireBtn) {
      sosTestModeEntireBtn.style.cssText =
        "flex: 1; border-radius: 6px; background: #ffffff; color: #092755; font-weight: 700; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); height: 32px;";
    }
    if (sosTestModeSpecificBtn) {
      sosTestModeSpecificBtn.style.cssText =
        "flex: 1; border-radius: 6px; background: transparent; color: #4B5563; font-weight: 600; border: none; height: 32px;";
    }
    if (sosTestZoneMultiSelectContainer) {
      sosTestZoneMultiSelectContainer.style.display = "none";
    }

    // Reset views
    if (sosTestModalBody) sosTestModalBody.style.display = "block";
    if (sosTestConfirmBody) sosTestConfirmBody.style.display = "none";
    if (sosTestLoadingBody) sosTestLoadingBody.style.display = "none";
    if (sosTestSuccessBody) sosTestSuccessBody.style.display = "none";
    if (sosTestModalFooter) sosTestModalFooter.style.display = "flex";

    if (cancelSosTestBroadcastBtn)
      cancelSosTestBroadcastBtn.style.display = "inline-flex";
    if (sosStartTestBtn) sosStartTestBtn.style.display = "inline-flex";
    if (sosConfirmBackBtn) sosConfirmBackBtn.style.display = "none";
    if (sosConfirmTestBroadcastBtn) {
      sosConfirmTestBroadcastBtn.style.display = "none";
      sosConfirmTestBroadcastBtn.disabled = true;
    }
    if (runAnotherTestBtn) runAnotherTestBtn.style.display = "none";
    if (doneSosTestBroadcastBtn) doneSosTestBroadcastBtn.style.display = "none";

    if (sosTestConfirmInput) sosTestConfirmInput.value = "";

    renderTestModalZonesList();
    renderTestModalResolution();
  }

  // Toggle dropdown open/close in modal
  if (sosTestZoneMultiSelect) {
    sosTestZoneMultiSelect.addEventListener("click", (e) => {
      const trigger = e.target.closest(".multi-select-trigger");
      if (trigger) {
        const parent = trigger.closest(".wilyer-multi-select");
        const dropdown = parent.querySelector(".multi-select-dropdown");
        const isOpen = dropdown.style.display === "block";
        dropdown.style.display = isOpen ? "none" : "block";
        if (!isOpen && sosTestZoneSearch) {
          sosTestZoneSearch.value = "";
          sosTestZoneSearch.focus();
          triggerSearchFiltering();
        }
        e.stopPropagation();
      }
    });
  }

  function triggerSearchFiltering() {
    if (!sosTestZoneSearch) return;
    const query = sosTestZoneSearch.value.toLowerCase().trim();
    sosTestZoneOptionsList
      .querySelectorAll(".test-zone-opt-item")
      .forEach((item) => {
        const name = item.getAttribute("data-name");
        if (name.includes(query)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
  }

  if (sosTestZoneSearch) {
    sosTestZoneSearch.addEventListener("keyup", triggerSearchFiltering);
  }

  // Document click to close modal zone multi-select dropdown
  document.addEventListener("click", (e) => {
    const drop = document.querySelector(
      "#sosTestZoneMultiSelect .multi-select-dropdown",
    );
    if (drop && !e.target.closest("#sosTestZoneMultiSelect")) {
      drop.style.display = "none";
    }
  });

  // Checkbox toggling in modal zone selection
  if (sosTestZoneOptionsList) {
    sosTestZoneOptionsList.addEventListener("change", (e) => {
      const chk = e.target.closest(".test-zone-checkbox");
      if (chk) {
        const zoneId = chk.getAttribute("data-id");
        if (chk.checked) {
          if (!selectedTestZones.includes(zoneId))
            selectedTestZones.push(zoneId);
        } else {
          selectedTestZones = selectedTestZones.filter((id) => id !== zoneId);
        }
        renderTestModalZonesList();
        renderTestModalResolution();
      }
    });
  }

  if (sosTestZoneSelectAllBtn) {
    sosTestZoneSelectAllBtn.addEventListener("click", (e) => {
      selectedTestZones = getConfiguredStep2Zones().map((z) => z.id);
      renderTestModalZonesList();
      renderTestModalResolution();
      e.stopPropagation();
    });
  }

  if (sosTestZoneClearAllBtn) {
    sosTestZoneClearAllBtn.addEventListener("click", (e) => {
      selectedTestZones = [];
      renderTestModalZonesList();
      renderTestModalResolution();
      e.stopPropagation();
    });
  }

  // Mode segmented buttons click listeners
  if (sosTestModeEntireBtn) {
    sosTestModeEntireBtn.addEventListener("click", () => {
      currentTestMode = "entire";
      selectedTestZones = getConfiguredStep2Zones().map((z) => z.id);

      sosTestModeEntireBtn.style.cssText =
        "flex: 1; border-radius: 6px; background: #ffffff; color: #092755; font-weight: 700; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); height: 32px;";
      if (sosTestModeSpecificBtn) {
        sosTestModeSpecificBtn.style.cssText =
          "flex: 1; border-radius: 6px; background: transparent; color: #4B5563; font-weight: 600; border: none; height: 32px;";
      }
      if (sosTestZoneMultiSelectContainer)
        sosTestZoneMultiSelectContainer.style.display = "none";

      renderTestModalZonesList();
      renderTestModalResolution();
    });
  }

  if (sosTestModeSpecificBtn) {
    sosTestModeSpecificBtn.addEventListener("click", () => {
      currentTestMode = "specific";
      // Start with empty select
      selectedTestZones = [];

      sosTestModeSpecificBtn.style.cssText =
        "flex: 1; border-radius: 6px; background: #ffffff; color: #092755; font-weight: 700; border: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); height: 32px;";
      if (sosTestModeEntireBtn) {
        sosTestModeEntireBtn.style.cssText =
          "flex: 1; border-radius: 6px; background: transparent; color: #4B5563; font-weight: 600; border: none; height: 32px;";
      }
      if (sosTestZoneMultiSelectContainer)
        sosTestZoneMultiSelectContainer.style.display = "block";

      renderTestModalZonesList();
      renderTestModalResolution();
    });
  }

  // Modal open action
  if (triggerTestBroadcastBtn) {
    triggerTestBroadcastBtn.addEventListener("click", () => {
      if (!sosTestBroadcastModal) return;
      initTestModalFlow();
      sosTestBroadcastModal.classList.add("open");
    });
  }

  function closeSosTestBroadcastModal() {
    if (sosTestBroadcastModal) {
      sosTestBroadcastModal.classList.remove("open");
    }
  }

  if (closeSosTestBroadcastModalBtn)
    closeSosTestBroadcastModalBtn.addEventListener(
      "click",
      closeSosTestBroadcastModal,
    );
  if (cancelSosTestBroadcastBtn)
    cancelSosTestBroadcastBtn.addEventListener(
      "click",
      closeSosTestBroadcastModal,
    );
  if (doneSosTestBroadcastBtn)
    doneSosTestBroadcastBtn.addEventListener(
      "click",
      closeSosTestBroadcastModal,
    );
  if (runAnotherTestBtn)
    runAnotherTestBtn.addEventListener("click", initTestModalFlow);

  // Click Trigger Test Broadcast -> Moves to Confirmation State (1.5)
  if (sosStartTestBtn) {
    sosStartTestBtn.addEventListener("click", () => {
      let zonesToTest = [];
      if (currentTestMode === "entire") {
        zonesToTest = getConfiguredStep2Zones();
      } else {
        zonesToTest = sosState.zones.filter((z) =>
          selectedTestZones.includes(z.id),
        );
      }

      if (zonesToTest.length === 0) {
        showToast("Please select at least one zone to test.", "error");
        return;
      }

      const resolved = resolveTestMappings(zonesToTest.map((z) => z.id));
      if (resolved.length === 0) {
        showToast(
          "No active layouts are mapped to the selected zones.",
          "error",
        );
        return;
      }

      // Transition to Confirmation Panel
      if (sosTestModalBody) sosTestModalBody.style.display = "none";
      if (sosTestConfirmBody) sosTestConfirmBody.style.display = "block";

      if (sosStartTestBtn) sosStartTestBtn.style.display = "none";
      if (cancelSosTestBroadcastBtn)
        cancelSosTestBroadcastBtn.style.display = "none";
      if (sosConfirmBackBtn) sosConfirmBackBtn.style.display = "inline-flex";
      if (sosConfirmTestBroadcastBtn) {
        sosConfirmTestBroadcastBtn.style.display = "inline-flex";
        sosConfirmTestBroadcastBtn.disabled = true;
      }

      // Populate confirmation text details
      if (sosConfirmSummaryZones) {
        sosConfirmSummaryZones.textContent = zonesToTest
          .map((z) => z.name)
          .join(", ");
      }
      if (sosConfirmSummaryScreens) {
        const totalScreens = zonesToTest.reduce((sum, z) => sum + z.screens, 0);
        sosConfirmSummaryScreens.textContent = `${totalScreens} Screens`;
      }
      if (sosConfirmSummaryLayouts) {
        sosConfirmSummaryLayouts.textContent = resolved
          .map((r) => r.layout)
          .join(", ");
      }
      if (sosConfirmSummaryTriggers) {
        sosConfirmSummaryTriggers.textContent = resolved
          .map((r) => r.triggerName)
          .join(", ");
      }

      if (sosTestConfirmInput) {
        sosTestConfirmInput.value = "";
        sosTestConfirmInput.focus();
      }
    });
  }

  // Go back from Confirmation view to Setup/Form view
  if (sosConfirmBackBtn) {
    sosConfirmBackBtn.addEventListener("click", () => {
      if (sosTestConfirmBody) sosTestConfirmBody.style.display = "none";
      if (sosTestModalBody) sosTestModalBody.style.display = "block";

      if (sosStartTestBtn) sosStartTestBtn.style.display = "inline-flex";
      if (cancelSosTestBroadcastBtn)
        cancelSosTestBroadcastBtn.style.display = "inline-flex";

      if (sosConfirmBackBtn) sosConfirmBackBtn.style.display = "none";
      if (sosConfirmTestBroadcastBtn)
        sosConfirmTestBroadcastBtn.style.display = "none";
    });
  }

  // Watch confirm input field
  if (sosTestConfirmInput) {
    sosTestConfirmInput.addEventListener("input", () => {
      const isConfirmed =
        sosTestConfirmInput.value.toUpperCase().trim() === "CONFIRM";
      if (sosConfirmTestBroadcastBtn) {
        sosConfirmTestBroadcastBtn.disabled = !isConfirmed;
      }
    });
  }

  // Start Test Broadcast button click (Confirmation authorized) -> Transitions to Loading (State 2)
  if (sosConfirmTestBroadcastBtn) {
    sosConfirmTestBroadcastBtn.addEventListener("click", () => {
      if (sosTestConfirmBody) sosTestConfirmBody.style.display = "none";
      if (sosTestModalFooter) sosTestModalFooter.style.display = "none";
      if (sosTestLoadingBody) sosTestLoadingBody.style.display = "block";

      // Rotate loading messages
      if (sosTestLoadingStatus)
        sosTestLoadingStatus.textContent = "Preparing emergency layout...";

      const timer1 = setTimeout(() => {
        if (sosTestLoadingStatus)
          sosTestLoadingStatus.textContent = "Sending to selected screens...";
      }, 750);

      const timer2 = setTimeout(() => {
        if (sosTestLoadingStatus)
          sosTestLoadingStatus.textContent =
            "Waiting for screen acknowledgements...";
      }, 1500);

      // Complete simulation and transition to Success Screen after 2.2s
      const timerSuccess = setTimeout(() => {
        if (sosTestLoadingBody) sosTestLoadingBody.style.display = "none";
        if (sosTestSuccessBody) sosTestSuccessBody.style.display = "block";
        if (sosTestModalFooter) sosTestModalFooter.style.display = "flex";

        // Show completion actions
        if (sosConfirmBackBtn) sosConfirmBackBtn.style.display = "none";
        if (sosConfirmTestBroadcastBtn)
          sosConfirmTestBroadcastBtn.style.display = "none";
        if (runAnotherTestBtn) runAnotherTestBtn.style.display = "inline-flex";
        if (doneSosTestBroadcastBtn)
          doneSosTestBroadcastBtn.style.display = "inline-flex";

        // Compute summary metrics for success screen
        let zonesToTest = [];
        if (currentTestMode === "entire") {
          zonesToTest = getConfiguredStep2Zones();
        } else {
          zonesToTest = sosState.zones.filter((z) =>
            selectedTestZones.includes(z.id),
          );
        }

        const totalScreens = zonesToTest.reduce((sum, z) => sum + z.screens, 0);
        const resolved = resolveTestMappings(zonesToTest.map((z) => z.id));

        const zoneText =
          zonesToTest.length > 2
            ? `${zonesToTest.length} Zones`
            : zonesToTest.map((z) => z.name).join(", ");
        const layoutsText = resolved.map((r) => r.layout).join(", ");

        // Calculate completion time
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const randDuration = (2.0 + Math.random() * 0.4).toFixed(1);

        // Populate success elements
        if (sosSummaryCardZones) sosSummaryCardZones.textContent = zoneText;
        if (sosSummaryCardScreens)
          sosSummaryCardScreens.textContent = `${totalScreens} / ${totalScreens}`;
        if (sosSummaryCardLayouts) {
          sosSummaryCardLayouts.innerHTML = resolved
            .map(
              (r) =>
                `<div style="font-weight:700;color:#EF4444;font-size:12.5px;">• ${r.layout}</div>`,
            )
            .join("");
        }
        if (sosSummaryCardCompleted)
          sosSummaryCardCompleted.textContent = timeStr;
        if (sosSummaryCardDuration)
          sosSummaryCardDuration.textContent = `${randDuration} sec`;

        showToast("Test Emergency Broadcast sent successfully.", "success");
      }, 2200);
    });
  }

  // Initial render when loading page
  renderSOSTriggersGrid();

  // ====================== SELECT ALL FUNCTIONALITY FOR PAYLOAD GROUPS ======================
  document.addEventListener("change", (e) => {
    if (e.target && e.target.classList.contains("select-all-payload")) {
      const group = e.target.getAttribute("data-group");
      const isChecked = e.target.checked;
      
      // Find the parent payload group
      const groupCard = e.target.closest(".payload-group-card");
      if (!groupCard) return;
      
      // Get all checkboxes in this group (except Select All)
      const checkboxes = groupCard.querySelectorAll(
        'input[type="checkbox"]:not(.select-all-payload)'
      );
      
      // Update all checkboxes based on Select All state
      checkboxes.forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
    }
  });

  // Sync Select All checkbox state when individual checkboxes change
  document.addEventListener("change", (e) => {
    if (
      e.target &&
      e.target.type === "checkbox" &&
      !e.target.classList.contains("select-all-payload")
    ) {
      const groupCard = e.target.closest(".payload-group-card");
      if (!groupCard) return;
      
      const selectAllCheckbox = groupCard.querySelector(".select-all-payload");
      if (!selectAllCheckbox) return;
      
      const allCheckboxes = groupCard.querySelectorAll(
        'input[type="checkbox"]:not(.select-all-payload)'
      );
      const checkedCount = Array.from(allCheckboxes).filter(
        (cb) => cb.checked
      ).length;
      
      // Update Select All state
      selectAllCheckbox.checked = checkedCount === allCheckboxes.length;
    }
  });
});;
