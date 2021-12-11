import shutil
import os
from box import Box
import ruamel.yaml
import yaml

try:
    shutil.rmtree('out')
except FileNotFoundError:
    pass

os.mkdir('out')

config = Box.from_yaml(filename='./config.yml', Loader=ruamel.yaml.Loader)
# print(config.blank)

data = []

for t in os.listdir('template'):
    with open(os.path.join('template', t), 'r') as template:
        for i, row in enumerate(template.read().splitlines()):
            for j, tile in enumerate(row):
                out = {
                    'x': j,
                    'z': i,
                    'type': None,
                    'rotation': None,
                    'color': None
                }

                match tile:
                    case config.blank:
                        pass

                    case config.start_up:
                        out['type'] = 'start'
                        out['rotation'] = 'up'
                    case config.start_down:
                        out['type'] = 'start'
                        out['rotation'] = 'down'
                    case config.start_left:
                        out['type'] = 'start'
                        out['rotation'] = 'left'
                    case config.start_right:
                        out['type'] = 'start'
                        out['rotation'] = 'right'

                    case config.wall_gray_1:
                        out['type'] = 'wall'
                        out['color'] = 'gray_0'
                    case config.wall_gray_2:
                        out['type'] = 'wall'
                        out['color'] = 'gray_1'
                    case config.decor_gray_1:
                        out['type'] = 'wall'
                        out['color'] = 'gray_2'
                    case config.decor_gray_2:
                        out['type'] = 'wall'
                        out['color'] = 'gray_3'
                    case config.decor_gray_3:
                        out['type'] = 'wall'
                        out['color'] = 'gray_4'

                    case config.wall_blue_1:
                        out['type'] = 'wall'
                        out['color'] = 'blue_0'
                    case config.wall_blue_2:
                        out['type'] = 'wall'
                        out['color'] = 'blue_1'
                    case config.decor_blue_1:
                        out['type'] = 'wall'
                        out['color'] = 'blue_2'
                    case config.decor_blue_2:
                        out['type'] = 'wall'
                        out['color'] = 'blue_3'

                    case config.wall_wood:
                        out['type'] = 'wall'
                        out['color'] = 'wood_0'
                    case config.decor_wood_1:
                        out['type'] = 'wall'
                        out['color'] = 'wood_1'
                    case config.decor_wood_2:
                        out['type'] = 'wall'
                        out['color'] = 'wood_2'

                    case config.door_normal:
                        out['type'] = 'door'
                        out['rotation'] = False
                        out['color'] = 'door_0'
                    case config.door_rotated:
                        out['type'] = 'door'
                        out['rotation'] = True
                        out['color'] = 'door_0'
                    case config.door_locked_normal:
                        out['type'] = 'door'
                        out['rotation'] = False
                        out['color'] = 'door_2'
                    case config.door_locked_rotated:
                        out['type'] = 'door'
                        out['rotation'] = True
                        out['color'] = 'door_2'

                    case config.wall_elevator:
                        out['type'] = 'wall'
                        out['color'] = 'elevator_0'
                    case config.decor_elevator_1:
                        out['type'] = 'wall'
                        out['color'] = 'elevator_3'
                    case config.decor_elevator_2:
                        out['type'] = 'wall'
                        out['color'] = 'elevator_2'
                    case config.door_elevator_normal:
                        out['type'] = 'elevator'
                        out['rotation'] = False
                        out['color'] = 'elevator_1'
                    case config.door_elevator_rotated:
                        out['type'] = 'elevator'
                        out['rotation'] = True
                        out['color'] = 'elevator_1'

                    case _:
                        pass
                
                if tile != config.blank:
                    data.append(out)
            # print(config.blank)
                # print()
        # for row in template.readlines():
        #     print(row)
    
    with open(os.path.join(
        'out', t.removesuffix('.template') + '.yml'
    ), 'w') as map:
        yaml.dump(data, map)
