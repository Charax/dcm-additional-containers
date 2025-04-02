import type { DockerTool } from "@/lib/docker-tools"

export const gaming: DockerTool[] = [
  
  {
    id: "foundryvtt",
    name: "Foundry Virtual Tabletop",
    description: "Virtual Tabletop for playing TTRPGs",
    category: "Gaming",
    tags: ["Gaming", "VTT", "FoundryVTT"],
    githubUrl: "https://github.com/felddy/foundryvtt-docker",
    icon: "https://cdn.jsdelivr.net/gh/selfhst/icons/png/foundry-virtual-tabletop.png",
    composeContent: `services:
  foundryvtt:
    image: felddy/foundryvtt-docker:latest
    container_name: \${CONTAINER_PREFIX}foundryvtt
    ports:
      - "30000:30000"
    volumes:
      - \${DATA_PATH}/foundryvtt:/data
    environment:
      - FOUNDRY_USERNAME=
      - FOUNDRY_PASSWORD=
      - CONTAINER_PRESERVE_CONFIG=True
    restart: \${RESTART_POLICY}`,
  },
]
