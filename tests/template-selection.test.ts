import { describe, expect, mock, test } from "bun:test";
import { TemplateCategory } from "../lib/template-categories";
import { templateDefinitions } from "../lib/template-definitions";
import { getToolsFromTemplate, templates } from "../lib/templates";
import { tools } from "../tools";

describe("Template Definitions Structure", () => {
  test("template definitions should match templates export", () => {
    expect(templates).toEqual(templateDefinitions);
    expect(templates.length).toBeGreaterThan(0);
    expect(templates.length).toBe(templateDefinitions.length);
  });

  test("template categories should be properly imported", () => {
    // Verify TemplateCategory enum is properly imported and working
    expect(TemplateCategory.MEDIA).toBe("Media");
    expect(TemplateCategory.DEVELOPMENT).toBe("Development");
    expect(TemplateCategory.MONITORING).toBe("Monitoring");
    expect(TemplateCategory.DATABASE).toBe("Database");
    expect(TemplateCategory.PRODUCTIVITY).toBe("Productivity");
    expect(TemplateCategory.SECURITY).toBe("Security");
    expect(TemplateCategory.OTHER).toBe("Other");
  });

  test("templates should use valid template categories", () => {
    const validCategories = Object.values(TemplateCategory);
    
    templates.forEach(template => {
      expect(validCategories).toContain(template.category);
    });
  });
});

describe("Template Selection Utilities", () => {
  test("getToolsFromTemplate should handle empty tools array", () => {
    const emptyTemplate = {
      id: "empty",
      name: "Empty Template",
      description: "A template with no tools",
      category: TemplateCategory.OTHER,
      tools: []
    };
    
    const result = getToolsFromTemplate(emptyTemplate, tools);
    expect(result).toEqual([]);
  });

  test("getToolsFromTemplate should handle non-existent tools", () => {
    const templateWithBadTools = {
      id: "bad-tools",
      name: "Bad Tools Template",
      description: "A template with non-existent tools",
      category: TemplateCategory.OTHER,
      tools: ["non-existent-tool-1", "non-existent-tool-2"]
    };
    
    const result = getToolsFromTemplate(templateWithBadTools, tools);
    expect(result).toEqual([]);
  });

  test("getToolsFromTemplate should handle mixed valid and invalid tools", () => {
    // Get a real tool ID from the tools array
    const realToolId = tools[0].id;
    
    const mixedTemplate = {
      id: "mixed-tools",
      name: "Mixed Tools Template",
      description: "A template with both valid and invalid tools",
      category: TemplateCategory.OTHER,
      tools: [realToolId, "non-existent-tool"]
    };
    
    const result = getToolsFromTemplate(mixedTemplate, tools);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(realToolId);
  });
});

// Mock component for testing template selection/unselection logic
describe("Template Selection/Unselection Logic", () => {
  test("selecting a template should add its tools without duplicates", () => {
    // Setup initial state
    const mockSetStoredTools = mock(() => {});
    const mockSetSelectedTemplateIds = mock(() => {});
    const currentStoredTools: string[] = ["tool1", "tool2"];
    const templateTools = [
      { id: "tool2", name: "Tool 2" },
      { id: "tool3", name: "Tool 3" }
    ];
    const template = { id: "template1", name: "Template 1" };
    
    // Simulate selecting the template
    const templateToolIds = templateTools.map(tool => tool.id);
    const newSelection = [...new Set([...currentStoredTools, ...templateToolIds])];
    mockSetStoredTools(newSelection);
    mockSetSelectedTemplateIds(prev => [...prev, template.id]);
    
    // Verify expectations
    expect(mockSetStoredTools).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedTemplateIds).toHaveBeenCalledTimes(1);
    expect(newSelection).toContain("tool1");
    expect(newSelection).toContain("tool2"); // Only included once despite being in both
    expect(newSelection).toContain("tool3");
    expect(newSelection.length).toBe(3);
  });
  
  test("unselecting a template should remove only its tools", () => {
    // Setup initial state
    const mockSetStoredTools = mock(() => {});
    const mockSetSelectedTemplateIds = mock(() => {});
    const currentStoredTools: string[] = ["tool1", "tool2", "tool3", "tool4"];
    const templateToolsToRemove = ["tool2", "tool3"];
    const templateId = "template1";
    
    // Simulate unselecting the template
    const newSelection = currentStoredTools.filter(id => !templateToolsToRemove.includes(id));
    mockSetStoredTools(newSelection);
    mockSetSelectedTemplateIds(prev => prev.filter(id => id !== templateId));
    
    // Verify expectations
    expect(mockSetStoredTools).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedTemplateIds).toHaveBeenCalledTimes(1);
    expect(newSelection).toContain("tool1");
    expect(newSelection).toContain("tool4");
    expect(newSelection).not.toContain("tool2");
    expect(newSelection).not.toContain("tool3");
    expect(newSelection.length).toBe(2);
  });
}); 