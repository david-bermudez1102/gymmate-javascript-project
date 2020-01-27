class View < ApplicationRecord
  belongs_to :viewable, polymorphic: true
end
