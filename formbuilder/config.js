export default {
  projectName: process.env.PROJECT_NAME || "Formbuilder",
  server: {
    remote: process.env.SERVER_URL,
    bucket: "formbuilder",
  },
  appURL: process.env.APP_URL || window.location.origin + window.location.pathname,
  fieldList: [
    {
      id: "nonInputText",
      icon: "text-color",
      label: "Short note",
      jsonSchema: {
        type: "null",
        title: "Edit me",
        description: ""
      },
      uiSchema: {
        editSchema: {
          id: "nonInputText",
          type: "object",
          properties: {
            title: {type: "string", title: "Title"},
            description: {type: "string", title: "Short note"}
          }
        }
      },
      formData: {}
    },
    {
      id: "nonInputMarkdown",
      icon: "text-color",
      label: "Long note",
      jsonSchema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:field": "markdownBlock",
        md: "MARK DOWN TEXT",
        editSchema: {
          id: "nonInputMarkdown",
          editor: "markdown"
        }
      },
      formData: {}
    },
    {
      id: "text",
      icon: "text-color",
      label: "Short text",
      jsonSchema: {
        type: "string",
        title: "Edit me",
        description: "",
        default: ""
      },
      uiSchema: {
        editSchema: {
          id: "text",
          type: "object",
          properties: {
            title: {type: "string", title: "Label"},
            description: {type: "string", title: "Short text description"},
            required: {type: "boolean"},
          }
        },
      },
      formData: {}
    },
    {
      id: "multilinetext",
      icon: "align-left",
      label: "Long text",
      jsonSchema: {
        type: "string",
        title: "Edit me",
        description: "",
        default: ""
      },
      uiSchema: {
        "ui:widget": "textarea",
        editSchema: {
          id: "multilinetext",
          type: "object",
          properties: {
            title: {type: "string", title: "Label"},
            description: {type: "string", title: "Long text description"},
            required: {type: "boolean"},
          }
        },
      },
      formData: {}
    },
    {
      id: "checkbox",
      icon: "check",
      label: "Checkbox",
      jsonSchema: {
        type: "boolean",
        title: "Edit me",
        default: false,
      },
      uiSchema: {
        editSchema: {
          id: "checkbox",
          type: "object",
          properties: {
            title: {type: "string", title: "Label"},
            required: {type: "boolean"},
          }
        },
      },
      formData: {}
    },
    {
      id: "multiple-checkbox",
      icon: "check",
      label: "Multiple choices",
      jsonSchema: {
        type: "array",
        title: "A multiple choices list",
        items: {
          type: "string",
          enum: ["choice 1", "choice 2", "choice 3"],
        },
        uniqueItems: true,
      },
      uiSchema: {
        "ui:widget": "checkboxes",
        editSchema: {
          id: "multiple-checkbox",
          type: "object",
          properties: {
            title: {type: "string", title: "Label"},
            required: {type: "boolean"},
            items: {
              type: "object",
              title: "Choices",
              properties: {
                enum: {
                  title: "",
                  type: "array",
                  items: {
                    type: "string"
                  },
                  default: ["choice 1", "choice 2", "choice 3"],
                }
              }
            }
          }
        },
      },
      formData: {}
    },
    {
      id: "radiobuttonlist",
      icon: "list",
      label: "Choice list",
      jsonSchema: {
        type: "string",
        title: "Edit me",
        enum: ["option 1", "option 2", "option 3"],
      },
      uiSchema: {
        "ui:widget": "radio",
        editSchema: {
          id: "radiobuttonlist",
          type: "object",
          properties: {
            title: {type: "string", title: "Label"},
            required: {type: "boolean"},
            enum: {
              type: "array",
              title: "Options",
              items: {
                type: "string"
              }
            }
          }
        },
      },
      formData: {}
    },
    {
      id: "select",
      icon: "chevron-down",
      label: "Select List",
      jsonSchema: {
        type: "string",
        format: "string",
        title: "Edit me",
        enum: ["option 1", "option 2", "option 3"],
      },
      uiSchema: {
        "ui:widget": "select",
        editSchema: {
          id: "select",
          type: "object",
          properties: {
            title: {type: "string", title: "Label"},
            required: {type: "boolean"},
            enum: {
              type: "array",
              title: "Options",
              items: {
                type: "string"
              }
            }
          }
        },
      },
      formData: {}
    },
    {
      id: "date",
      icon: "calendar",
      label: "Date",
      jsonSchema: {
        type: "string",
        format: "date",
        title: "Edit me",
      },
      uiSchema: {
        editSchema: {
          id: "date",
          type: "object",
          properties: {
            title: {type: "string", title: "Label"},
            required: {type: "boolean"}
          }
        },
      },
      formData: {}
    },
  ],
};
